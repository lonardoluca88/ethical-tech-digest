import { NewsItem, NewsCategory, NewsSource } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';

interface PerplexitySearchResponse {
  id: string;
  choices: {
    index: number;
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
}

interface NewsSearchResult {
  title: string;
  url: string;
  summary: string;
  date: string;
  category?: NewsCategory;
}

// Chiave per localStorage
const PERPLEXITY_API_KEY_STORAGE = 'ethical_tech_digest_perplexity_key';

export class PerplexitySearchService {
  private static apiKey: string | null = null;
  
  static async setApiKey(key: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('set-perplexity-key', {
        body: { key }
      });
      
      if (error) {
        throw new Error('Errore nel salvare l\'API key: ' + error.message);
      }
      
      this.apiKey = key;
    } catch (error) {
      // Se la funzione Edge fallisce, usa localStorage come fallback
      this.setLocalApiKey(key);
      throw error; // Rilancia l'errore per gestirlo nel componente
    }
  }
  
  // Nuovo metodo per impostare la chiave direttamente nel localStorage
  static setLocalApiKey(key: string): void {
    localStorage.setItem(PERPLEXITY_API_KEY_STORAGE, key);
    this.apiKey = key;
  }
  
  static async getApiKey(): Promise<string | null> {
    // Se abbiamo già la chiave in memoria, la restituiamo
    if (this.apiKey) return this.apiKey;
    
    try {
      // Prova prima da Supabase
      const { data, error } = await supabase.functions.invoke('get-perplexity-key');
      
      if (error) {
        // Se c'è un errore, prova da localStorage
        const localKey = localStorage.getItem(PERPLEXITY_API_KEY_STORAGE);
        
        if (localKey) {
          this.apiKey = localKey;
          return localKey;
        }
        
        console.error('Errore nel recuperare l\'API key:', error);
        return null;
      }
      
      if (data?.key) {
        this.apiKey = data.key;
        return data.key;
      }
      
      // Se non c'è la chiave su Supabase, prova da localStorage
      const localKey = localStorage.getItem(PERPLEXITY_API_KEY_STORAGE);
      
      if (localKey) {
        this.apiKey = localKey;
        return localKey;
      }
      
      return null;
    } catch (error) {
      // Se fallisce la chiamata, prova da localStorage
      const localKey = localStorage.getItem(PERPLEXITY_API_KEY_STORAGE);
      
      if (localKey) {
        this.apiKey = localKey;
        return localKey;
      }
      
      console.error('Errore nel recuperare l\'API key:', error);
      return null;
    }
  }
  
  static async clearApiKey(): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('clear-perplexity-key');
      
      if (error) {
        throw new Error('Errore nella rimozione dell\'API key: ' + error.message);
      }
      
      this.apiKey = null;
    } catch (error) {
      // Se la funzione Edge fallisce, cancella dal localStorage
      this.clearLocalApiKey();
      throw error; // Rilancia l'errore per gestirlo nel componente
    }
  }
  
  // Nuovo metodo per cancellare la chiave dal localStorage
  static clearLocalApiKey(): void {
    localStorage.removeItem(PERPLEXITY_API_KEY_STORAGE);
    this.apiKey = null;
  }
  
  static async searchNewsFromSource(source: NewsSource, category: NewsCategory): Promise<NewsSearchResult[]> {
    const apiKey = await this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key non configurata. Configura una Perplexity API key nelle impostazioni.');
    }
    
    const keywords = this.getCategoryKeywords(category);
    const keywordsStr = keywords.join(', ');
    
    const searchPrompt = `
      Cerca notizie recenti (massimo degli ultimi 7 giorni) riguardanti i risvolti etici della tecnologia, 
      specificamente nel campo della ${this.getCategoryName(category)} (${keywordsStr}) 
      dal sito ${source.url}.
      
      Trova al massimo 3 notizie rilevanti che discutono in qualche modo di etica e ${this.getCategoryName(category)}.
      
      Per ogni notizia fornisci le seguenti informazioni in formato JSON:
      - title: il titolo dell'articolo
      - url: l'URL completo dell'articolo
      - summary: un breve riassunto dell'articolo in italiano (massimo 200 caratteri) che menzioni gli aspetti etici
      - date: la data di pubblicazione in formato YYYY-MM-DD
      
      Rispondi SOLO con un array JSON valido contenente gli oggetti delle notizie, nient'altro.
    `;
    
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Sei un assistente specializzato nella ricerca di notizie sui risvolti etici delle nuove tecnologie. Rispondi solo con JSON parsabile.'
            },
            {
              role: 'user',
              content: searchPrompt
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          search_domain_filter: [source.url],
          search_recency_filter: 'month'
        }),
      });
    
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Perplexity API error:', errorData);
        throw new Error(`Errore API: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json() as PerplexitySearchResponse;
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Risposta vuota dall\'API');
      }
      
      // Estrai il JSON dalla risposta dell'API
      try {
        // Cerca di estrarre il JSON dalla risposta (nel caso ci siano commenti)
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        const searchResults = JSON.parse(jsonString) as NewsSearchResult[];
        return searchResults;
      } catch (parseError) {
        console.error('Errore parsing JSON:', parseError, 'Contenuto:', content);
        throw new Error('Impossibile interpretare la risposta dell\'API come JSON');
      }
    } catch (error) {
      console.error(`Errore durante la ricerca sul sito ${source.url}:`, error);
      throw error;
    }
  }
  
  private static getCategoryName(category: NewsCategory): string {
    switch (category) {
      case 'ai': return 'Intelligenza Artificiale';
      case 'robotics': return 'Robotica';
      case 'biotech': return 'Biotecnologia';
      default: return 'Tecnologia';
    }
  }
  
  private static getCategoryKeywords(category: NewsCategory): string[] {
    switch (category) {
      case 'ai':
        return ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'AI ethics', 'generative AI', 'large language model', 'LLM'];
      case 'robotics':
        return ['robotics', 'automation', 'autonomous', 'robot', 'drone', 'robot ethics', 'robotic process', 'human-robot interaction'];
      case 'biotech':
        return ['biotechnology', 'genomics', 'crispr', 'genetic engineering', 'bioethics', 'synthetic biology', 'gene editing', 'biotech ethics'];
      default:
        return ['ethics', 'technology', 'digital ethics'];
    }
  }
}

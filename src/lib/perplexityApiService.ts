
import { NewsCategory, NewsSource } from '@/lib/types';
import { ApiKeyService } from './apiKeyService';
import { PerplexitySearchResponse, NewsSearchResult } from './types/perplexityTypes';
import { generateSearchPrompt } from './utils/searchPromptUtils';

export class PerplexityApiService {
  /**
   * Search for news using the Perplexity API
   */
  static async searchNewsFromSource(source: NewsSource, category: NewsCategory): Promise<NewsSearchResult[]> {
    const apiKey = await ApiKeyService.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key non configurata. Configura una Perplexity API key nelle impostazioni.');
    }
    
    const searchPrompt = generateSearchPrompt(source, category);
    
    try {
      console.log(`Ricerca notizie per ${source.name} nella categoria ${category}...`);
      console.log(`URL del sito: ${source.url}`);
      
      // Estrai il dominio principale dall'URL per utilizzarlo nel filtro
      let searchDomain = source.url;
      try {
        const urlObj = new URL(source.url);
        searchDomain = urlObj.hostname;
        console.log(`Dominio estratto per ricerca: ${searchDomain}`);
      } catch (error) {
        console.warn(`Impossibile estrarre dominio da ${source.url}, uso URL completo`);
      }
      
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
              content: 'Sei un assistente specializzato nella ricerca di notizie recenti sui risvolti etici delle nuove tecnologie. Rispondi solo con JSON parsabile. Cerca SOLO notizie degli ultimi 7 giorni, idealmente 2-3 giorni.'
            },
            {
              role: 'user',
              content: searchPrompt
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          search_domain_filter: [searchDomain],
          search_recency_filter: 'day'
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
      
      console.log('Risposta API ricevuta:', content.substring(0, 200) + '...');
      
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        const results = JSON.parse(jsonString) as NewsSearchResult[];
        
        console.log(`Trovati ${results.length} risultati per ${source.name} nella categoria ${category}`);
        
        if (results.length === 0) {
          console.warn(`Nessun risultato trovato per ${source.name} nella categoria ${category}`);
        } else {
          console.log('Primo articolo trovato:', results[0].title, results[0].date);
        }
        
        return results;
      } catch (parseError) {
        console.error('Errore parsing JSON:', parseError, 'Contenuto:', content);
        throw new Error('Impossibile interpretare la risposta dell\'API come JSON');
      }
    } catch (error) {
      console.error(`Errore durante la ricerca sul sito ${source.url}:`, error);
      throw error;
    }
  }
}

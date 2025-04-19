
import { NewsCategory, NewsSource } from '@/lib/types';
import { ApiKeyService } from './apiKeyService';
import { PerplexitySearchResponse, NewsSearchResult } from './types/perplexityTypes';
import { generateSearchPrompt } from './utils/searchPromptUtils';

export class PerplexityApiService {
  /**
   * Search for news using the Perplexity API with timeout and retries
   */
  static async searchNewsFromSource(source: NewsSource, category: NewsCategory): Promise<NewsSearchResult[]> {
    const apiKey = await ApiKeyService.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key non configurata. Configura una Perplexity API key nelle impostazioni.');
    }
    
    const searchPrompt = generateSearchPrompt(source, category);
    const MAX_RETRIES = 3;
    const TIMEOUT = 60000; // Extended to 60 seconds timeout for more thorough search
    
    try {
      console.log(`Inizio ricerca notizie per ${source.name} nella categoria ${category}...`);
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

      let attempt = 0;
      while (attempt < MAX_RETRIES) {
        attempt++;
        console.log(`Tentativo ${attempt} di ${MAX_RETRIES}...`);
        
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
          
          const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
            body: JSON.stringify({
              model: 'llama-3.1-sonar-small-128k-online',
              messages: [
                {
                  role: 'system',
                  content: 'Sei un assistente specializzato nella ricerca di notizie recenti sui risvolti etici delle nuove tecnologie. Rispondi solo con JSON parsabile. Cerca SOLO notizie degli ultimi 7 giorni, idealmente 2-3 giorni. La tua PRIORITÀ ASSOLUTA è fornire URL completi (con http:// o https://), funzionanti e accessibili che puntino direttamente agli articoli specifici. VERIFICA SEMPRE GLI URL PRIMA DI FORNIRLI.'
                },
                {
                  role: 'user',
                  content: searchPrompt
                }
              ],
              temperature: 0.1, // Lower temperature for more deterministic results
              top_p: 0.9,
              max_tokens: 1500, // Increased token limit for more detailed results
              search_domain_filter: [searchDomain], 
              search_recency_filter: 'day',
              web_search_explicitly_requested: true, // Explicitly request web search
              true_it_is_okay_to_not_think_step_by_step: true, // Use Perplexity's search directly
              frequency_penalty: 0.5,
              presence_penalty: 0.1
            }),
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`Errore API (tentativo ${attempt}):`, errorData);
            if (attempt === MAX_RETRIES) {
              throw new Error(`Errore API: ${response.status} ${response.statusText}`);
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
            continue;
          }
          
          const data = await response.json() as PerplexitySearchResponse;
          const content = data.choices[0]?.message?.content;
          
          if (!content) {
            console.warn(`Risposta vuota dall'API (tentativo ${attempt})`);
            if (attempt === MAX_RETRIES) {
              throw new Error('Risposta vuota dall\'API');
            }
            continue;
          }
          
          console.log(`Risposta API ricevuta (tentativo ${attempt}):`, content.substring(0, 200) + '...');
          
          try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            const jsonString = jsonMatch ? jsonMatch[0] : content;
            const results = JSON.parse(jsonString) as NewsSearchResult[];
            
            console.log(`Trovati ${results.length} risultati per ${source.name} nella categoria ${category}`);
            
            // Validazione più rigorosa degli URL
            const validatedResults = results.filter(result => {
              try {
                // Verifica se l'URL è sintaticamente valido
                const urlObj = new URL(result.url);
                const isValidUrl = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
                
                if (!isValidUrl) {
                  console.warn(`URL non valido scartato: ${result.url}`);
                }
                
                // Verifica che non sia un URL parziale o generico
                const isNotGeneric = urlObj.pathname !== '/' && urlObj.pathname.length > 1;
                
                if (!isNotGeneric) {
                  console.warn(`URL generico scartato: ${result.url}`);
                }
                
                return isValidUrl && isNotGeneric;
              } catch (error) {
                console.warn(`URL malformato scartato: ${result.url}`);
                return false;
              }
            });
            
            if (validatedResults.length === 0) {
              console.warn(`Nessun risultato con URL valido trovato per ${source.name} nella categoria ${category}`);
              if (attempt < MAX_RETRIES) {
                console.log('Riprovo con parametri diversi...');
                continue;
              }
            } else {
              console.log('Primi articoli trovati:');
              validatedResults.forEach((result, i) => {
                console.log(`[${i + 1}] Titolo: ${result.title}`);
                console.log(`    URL: ${result.url}`);
                console.log(`    Data: ${result.date || 'Non specificata'}`);
              });
            }
            
            return validatedResults;
          } catch (parseError) {
            console.error(`Errore parsing JSON (tentativo ${attempt}):`, parseError, 'Contenuto:', content);
            if (attempt === MAX_RETRIES) {
              throw new Error('Impossibile interpretare la risposta dell\'API come JSON');
            }
          }
        } catch (fetchError) {
          if (fetchError.name === 'AbortError') {
            console.warn(`Timeout raggiunto dopo ${TIMEOUT}ms (tentativo ${attempt})`);
          } else {
            console.error(`Errore durante la richiesta (tentativo ${attempt}):`, fetchError);
          }
          
          if (attempt === MAX_RETRIES) {
            throw fetchError;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      throw new Error(`Tutti i tentativi falliti per ${source.name} nella categoria ${category}`);
    } catch (error) {
      console.error(`Errore durante la ricerca sul sito ${source.url}:`, error);
      throw error;
    }
  }
}

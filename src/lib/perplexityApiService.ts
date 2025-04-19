
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
    const TIMEOUT = 120000; // Extended to 120 seconds timeout for more thorough search
    
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
                  content: 'Sei un assistente specializzato nella ricerca di notizie recenti sui risvolti etici delle nuove tecnologie. Rispondi SOLO con JSON parsabile. La tua PRIORITÀ ASSOLUTA è fornire URL completi e funzionanti. Quando fornisci URL, assicurati che abbiano il protocollo (http:// o https://), un dominio completo, e percorso completo. NON fornire URL troncati o parziali. Verifica e controlla SEMPRE che ogni URL sia accessibile e valido prima di includerlo nella risposta.'
                },
                {
                  role: 'user',
                  content: searchPrompt
                }
              ],
              temperature: 0.05, // Lower temperature for more deterministic results
              top_p: 0.9,
              max_tokens: 2000, // Increased token limit for more detailed results
              search_domain_filter: [searchDomain], 
              search_recency_filter: 'day',
              web_search_explicitly_requested: true,
              true_it_is_okay_to_not_think_step_by_step: true, // Use Perplexity's search directly
              frequency_penalty: 0.5,
              presence_penalty: 0.1,
              stream: false
            }),
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch (e) {
              errorData = { error: errorText };
            }
            
            console.error(`Errore API (tentativo ${attempt}):`, errorData);
            
            // Check if it's a rate limit error
            if (response.status === 429) {
              console.warn('Rate limit raggiunto. Attendo prima di riprovare...');
              // Wait a bit longer if rate limited
              await new Promise(resolve => setTimeout(resolve, 10000));
            }
            
            if (attempt === MAX_RETRIES) {
              throw new Error(`Errore API: ${response.status} ${response.statusText}`);
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 5000));
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
            // Try to parse as JSON directly
            let results: NewsSearchResult[];
            try {
              results = JSON.parse(content) as NewsSearchResult[];
            } catch (e) {
              // If direct parse fails, try to extract JSON array from content
              const jsonMatch = content.match(/\[[\s\S]*\]/);
              if (!jsonMatch) {
                throw new Error('Impossibile estrarre un array JSON valido dalla risposta');
              }
              const jsonString = jsonMatch[0];
              results = JSON.parse(jsonString) as NewsSearchResult[];
            }
            
            console.log(`Trovati ${results.length} risultati per ${source.name} nella categoria ${category}`);
            
            // Validazione rigorosa degli URL
            const validatedResults = results.filter(result => {
              // Prima verifica che ci sia un URL
              if (!result.url) {
                console.warn('Risultato senza URL scartato');
                return false;
              }
              
              try {
                // Verifica se l'URL è sintaticamente valido
                const urlObj = new URL(result.url);
                const isValidUrl = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
                
                // Verifica che non sia un URL parziale o generico
                const isNotGeneric = urlObj.pathname !== '/' && 
                                    urlObj.pathname.length > 1 && 
                                    urlObj.hostname.includes('.');
                
                // Verifica che l'URL contenga il dominio richiesto
                const matchesDomain = urlObj.hostname.includes(searchDomain) || 
                                     searchDomain.includes(urlObj.hostname);
                
                if (!isValidUrl) {
                  console.warn(`URL non valido scartato: ${result.url}`);
                  return false;
                }
                
                if (!isNotGeneric) {
                  console.warn(`URL generico scartato: ${result.url}`);
                  return false;
                }
                
                if (!matchesDomain) {
                  console.warn(`URL con dominio diverso scartato: ${result.url}`);
                  return false;
                }
                
                return true;
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
              console.log('Articoli trovati:');
              validatedResults.forEach((result, i) => {
                console.log(`[${i + 1}] Titolo: ${result.title}`);
                console.log(`    URL: ${result.url}`);
                console.log(`    Data: ${result.date || 'Non specificata'}`);
                console.log(`    Summary: ${result.summary?.substring(0, 50)}...`);
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
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      
      throw new Error(`Tutti i tentativi falliti per ${source.name} nella categoria ${category}`);
    } catch (error) {
      console.error(`Errore durante la ricerca sul sito ${source.url}:`, error);
      throw error;
    }
  }
}

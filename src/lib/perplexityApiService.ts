
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
      
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        return JSON.parse(jsonString) as NewsSearchResult[];
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

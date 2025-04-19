
import { NewsItem, NewsCategory, NewsSource } from '@/lib/types';
import { ApiKeyService } from './apiKeyService';
import { PerplexityApiService } from './perplexityApiService';

export class PerplexitySearchService {
  /**
   * Imposta una chiave API Perplexity
   */
  static async setApiKey(key: string): Promise<void> {
    return ApiKeyService.setApiKey(key);
  }
  
  /**
   * Imposta la chiave API direttamente nel localStorage
   */
  static setLocalApiKey(key: string): void {
    ApiKeyService.setLocalApiKey(key);
  }
  
  /**
   * Recupera la chiave API Perplexity
   */
  static async getApiKey(): Promise<string | null> {
    return ApiKeyService.getApiKey();
  }
  
  /**
   * Cancella la chiave API Perplexity
   */
  static async clearApiKey(): Promise<void> {
    return ApiKeyService.clearApiKey();
  }
  
  /**
   * Cancella la chiave API dal localStorage
   */
  static clearLocalApiKey(): void {
    ApiKeyService.clearLocalApiKey();
  }
  
  /**
   * Cerca notizie da una fonte specifica e categoria
   */
  static async searchNewsFromSource(source: NewsSource, category: NewsCategory): Promise<NewsItem[]> {
    try {
      const searchResults = await PerplexityApiService.searchNewsFromSource(source, category);
      
      // Converte i risultati della ricerca in NewsItem
      return searchResults.map(result => ({
        id: crypto.randomUUID(),
        title: result.title,
        summary: result.summary,
        url: result.url,
        date: result.date || new Date().toISOString().split('T')[0],
        sourceId: source.id,
        category: category,
        imageUrl: `https://picsum.photos/seed/${result.title.replace(/\s+/g, '')}/400/300`
      }));
    } catch (error) {
      console.error(`Errore durante la ricerca sul sito ${source.url}:`, error);
      throw error;
    }
  }
}

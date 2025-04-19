
import { NewsItem, NewsSource } from '@/lib/types';
import { PerplexitySearchService } from './perplexitySearchService';
import { NewsSchedulerService } from './services/newsSchedulerService';
import { NewsStorageService } from './services/newsStorageService';

export interface FetchNewsResult {
  success: boolean;
  message: string;
  newArticlesCount?: number;
}

export class NewsFetchingService {
  /**
   * Schedules the daily news fetch at 6:00 AM
   */
  static scheduleDailyFetch(): void {
    NewsSchedulerService.scheduleDailyFetch(this.checkAndFetchNews);
  }

  /**
   * Checks if news should be fetched and fetches if needed
   */
  static async checkAndFetchNews(): Promise<FetchNewsResult> {
    try {
      if (NewsStorageService.shouldFetchNews()) {
        return await NewsFetchingService.fetchNews();
      }
      
      return {
        success: true,
        message: 'Skipped fetching: Last fetch was less than 12 hours ago'
      };
    } catch (error) {
      console.error('Error checking if news should be fetched:', error);
      return {
        success: false,
        message: `Failed to check if news should be fetched: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Verifica se una notizia è un duplicato basandosi su URL e titolo
   */
  private static isDuplicate(newItem: NewsItem, existingItems: NewsItem[]): boolean {
    return existingItems.some(existing => 
      // Confronto URL normalizzati (rimuovendo parametri UTM e altri tracciamenti)
      this.normalizeUrl(existing.url) === this.normalizeUrl(newItem.url) || 
      // Confronto titoli normalizzati
      this.normalizeTitle(existing.title) === this.normalizeTitle(newItem.title) ||
      // Confronto di similarità dei riassunti
      (existing.summary && newItem.summary && 
       this.calculateSimilarity(existing.summary, newItem.summary) > 0.75)
    );
  }

  /**
   * Normalizza l'URL rimuovendo parametri di tracciamento
   */
  private static normalizeUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      // Rimozione dei parametri UTM e altri parametri di tracciamento
      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
      trackingParams.forEach(param => parsedUrl.searchParams.delete(param));
      return parsedUrl.origin + parsedUrl.pathname;
    } catch (error) {
      // Se l'URL non è valido, restituisci l'originale
      return url;
    }
  }

  /**
   * Normalizza il titolo per il confronto (rimuove spazi extra e converte in minuscolo)
   */
  private static normalizeTitle(title: string): string {
    return title.toLowerCase().trim().replace(/\s+/g, ' ');
  }
  
  /**
   * Calcola la similarità tra due stringhe (0-1)
   * Usa una versione semplificata di Jaccard similarity
   */
  private static calculateSimilarity(str1: string, str2: string): number {
    const set1 = new Set(this.normalizeTitle(str1).split(' ').filter(word => word.length > 3));
    const set2 = new Set(this.normalizeTitle(str2).split(' ').filter(word => word.length > 3));
    
    if (set1.size === 0 || set2.size === 0) return 0;
    
    let intersection = 0;
    for (const word of set1) {
      if (set2.has(word)) {
        intersection++;
      }
    }
    
    const union = set1.size + set2.size - intersection;
    return intersection / union;
  }

  /**
   * Fetches news from sources using Perplexity AI and updates storage
   */
  static async fetchNews(): Promise<FetchNewsResult> {
    try {
      // Get sources from localStorage
      const sourcesStr = localStorage.getItem('ethicalTechDigest_sources');
      const sources: NewsSource[] = sourcesStr ? JSON.parse(sourcesStr) : [];
      
      if (sources.length === 0) {
        console.warn('No news sources found. Using dummy data.');
        NewsStorageService.ensureDummyNews();
        return {
          success: true,
          message: 'No sources found. Using dummy data.',
          newArticlesCount: 0
        };
      }
      
      // Check if Perplexity API key is configured
      if (!await PerplexitySearchService.getApiKey()) {
        return {
          success: false,
          message: 'API key Perplexity non configurata. Configura una chiave nelle impostazioni.',
        };
      }
      
      // Get existing news
      const existingNews = NewsStorageService.loadNews();
      
      // Track new articles
      let newArticlesCount = 0;
      const allNews = [...existingNews];
      const categories = ['ai', 'robotics', 'biotech'] as const;
      
      // Process each source and category
      for (const source of sources) {
        for (const category of categories) {
          try {
            console.log(`Cercando notizie da ${source.name} per la categoria ${category}...`);
            const newsItems = await PerplexitySearchService.searchNewsFromSource(source, category);
            
            // Add only non-duplicate items with valid URLs
            for (const item of newsItems) {
              // Verifica che l'URL sia valido e completo
              let isValidUrl = false;
              try {
                const url = new URL(item.url);
                isValidUrl = (url.protocol === 'http:' || url.protocol === 'https:') && 
                             url.hostname.length > 0 && 
                             url.pathname !== '/';
              } catch (e) {
                isValidUrl = false;
              }
              
              if (!isValidUrl) {
                console.warn(`URL non valido, articolo saltato: ${item.title}`);
                console.warn(`URL problematico: ${item.url}`);
                continue;
              }
              
              if (!this.isDuplicate(item, allNews)) {
                allNews.push(item);
                newArticlesCount++;
                console.log(`Nuovo articolo trovato: ${item.title}`);
                console.log(`URL: ${item.url}`);
              } else {
                console.log(`Articolo duplicato saltato: ${item.title}`);
              }
            }
          } catch (categoryError) {
            console.error(`Error fetching ${category} news from ${source.name}:`, categoryError);
          }
        }
      }
      
      // Update storage
      NewsStorageService.saveNews(allNews);
      NewsStorageService.updateLastFetchTime();
      
      return {
        success: true,
        message: `Fetched ${newArticlesCount} new articles`,
        newArticlesCount
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      return {
        success: false,
        message: `Failed to fetch news: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Pulisce l'archivio notizie e cerca nuove notizie
   */
  static async clearAndRefreshNews(): Promise<FetchNewsResult> {
    try {
      // Pulisce l'archivio notizie
      NewsStorageService.clearNewsArchive();
      console.log("Archivio notizie svuotato, ricerca nuove notizie...");
      
      // Cerca nuove notizie
      return await this.fetchNews();
    } catch (error) {
      console.error('Error clearing and refreshing news:', error);
      return {
        success: false,
        message: `Failed to clear and refresh news: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Manual trigger for news fetch
   */
  static async refreshNews(): Promise<FetchNewsResult> {
    return await NewsFetchingService.fetchNews();
  }
}

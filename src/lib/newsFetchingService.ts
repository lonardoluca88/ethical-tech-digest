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
      existing.url === newItem.url || 
      this.normalizeTitle(existing.title) === this.normalizeTitle(newItem.title)
    );
  }

  /**
   * Normalizza il titolo per il confronto (rimuove spazi extra e converte in minuscolo)
   */
  private static normalizeTitle(title: string): string {
    return title.toLowerCase().trim().replace(/\s+/g, ' ');
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
            
            // Add only non-duplicate items
            for (const item of newsItems) {
              if (!this.isDuplicate(item, allNews)) {
                allNews.push(item);
                newArticlesCount++;
                console.log(`Nuovo articolo trovato: ${item.title}`);
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
   * Manual trigger for news fetch
   */
  static async refreshNews(): Promise<FetchNewsResult> {
    return await NewsFetchingService.fetchNews();
  }
}

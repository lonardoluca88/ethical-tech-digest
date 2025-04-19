
import { NewsItem } from '@/lib/types';
import { dummyNews } from '@/lib/dummyData';

const STORAGE_KEYS = {
  NEWS: 'ethicalTechDigest_news',
  LAST_FETCH: 'ethicalTechDigest_lastFetch'
};

export class NewsStorageService {
  /**
   * Load news from storage or return dummy data
   */
  static loadNews(): NewsItem[] {
    try {
      const savedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
      return savedNews ? JSON.parse(savedNews) : dummyNews;
    } catch (error) {
      console.error('Error loading news from storage:', error);
      return dummyNews;
    }
  }

  /**
   * Save news to storage
   */
  static saveNews(news: NewsItem[]): void {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  }

  /**
   * Update last fetch timestamp
   */
  static updateLastFetchTime(): void {
    localStorage.setItem(STORAGE_KEYS.LAST_FETCH, new Date().toISOString());
  }

  /**
   * Check if we should fetch news (more than 12 hours since last fetch)
   */
  static shouldFetchNews(): boolean {
    const lastFetchStr = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
    if (!lastFetchStr) return true;
    
    const now = new Date();
    const lastFetch = new Date(lastFetchStr);
    return now.getTime() - lastFetch.getTime() > 12 * 60 * 60 * 1000;
  }

  /**
   * Ensure we have at least dummy news if nothing else
   */
  static ensureDummyNews(): void {
    if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
      this.saveNews(dummyNews);
      console.log('Dummy news added to localStorage');
    }
  }
}

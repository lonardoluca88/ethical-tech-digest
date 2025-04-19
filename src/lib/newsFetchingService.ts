import { NewsItem, NewsCategory, NewsSource } from '@/lib/types';
import { dummyNews } from '@/lib/dummyData';
import { PerplexitySearchService } from './perplexitySearchService';

const STORAGE_KEYS = {
  NEWS: 'ethicalTechDigest_news',
  SOURCES: 'ethicalTechDigest_sources',
  LAST_FETCH: 'ethicalTechDigest_lastFetch'
};

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
    // Check if already scheduled
    if (localStorage.getItem('newsSchedulerActive') === 'true') {
      console.log('News scheduler already active');
      return;
    }

    this.checkAndFetchNews()
      .then(result => {
        console.log('Initial news fetch result:', result);
      })
      .catch(error => {
        console.error('Error in initial news fetch:', error);
      });

    // Schedule next run at 6:00 AM
    this.scheduleNextRun();
    
    // Mark as scheduled
    localStorage.setItem('newsSchedulerActive', 'true');

    console.log('Daily news fetch scheduled for 6:00 AM');
  }

  /**
   * Calculates the time until the next 6:00 AM and schedules the fetch
   */
  private static scheduleNextRun(): void {
    const now = new Date();
    const nextRun = new Date(now);
    
    // Set time to 6:00 AM
    nextRun.setHours(6, 0, 0, 0);
    
    // If it's already past 6:00 AM, schedule for tomorrow
    if (now >= nextRun) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const timeUntilNextRun = nextRun.getTime() - now.getTime();
    console.log(`Next news fetch scheduled in ${Math.floor(timeUntilNextRun / (1000 * 60 * 60))} hours and ${Math.floor((timeUntilNextRun % (1000 * 60 * 60)) / (1000 * 60))} minutes`);
    
    setTimeout(() => {
      this.checkAndFetchNews()
        .then(result => {
          console.log('Scheduled news fetch result:', result);
          // Schedule the next run
          this.scheduleNextRun();
        })
        .catch(error => {
          console.error('Error in scheduled news fetch:', error);
          // Still schedule next run even if there was an error
          this.scheduleNextRun();
        });
    }, timeUntilNextRun);
  }

  /**
   * Checks if news should be fetched and fetches if needed
   */
  static async checkAndFetchNews(): Promise<FetchNewsResult> {
    try {
      const lastFetchStr = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
      const now = new Date();
      
      // If no last fetch or last fetch was more than 12 hours ago, fetch news
      if (!lastFetchStr || (now.getTime() - new Date(lastFetchStr).getTime() > 12 * 60 * 60 * 1000)) {
        return await this.fetchNews();
      } else {
        return {
          success: true,
          message: 'Skipped fetching: Last fetch was less than 12 hours ago'
        };
      }
    } catch (error) {
      console.error('Error checking if news should be fetched:', error);
      return {
        success: false,
        message: `Failed to check if news should be fetched: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Fetches news from sources using Perplexity AI and updates storage
   */
  static async fetchNews(): Promise<FetchNewsResult> {
    try {
      // Get sources from localStorage
      const sourcesStr = localStorage.getItem(STORAGE_KEYS.SOURCES);
      const sources: NewsSource[] = sourcesStr ? JSON.parse(sourcesStr) : [];
      
      if (sources.length === 0) {
        console.warn('No news sources found. Using dummy data.');
        // If no sources, make sure we at least have the dummy data
        this.ensureDummyNews();
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
      const existingNewsStr = localStorage.getItem(STORAGE_KEYS.NEWS);
      const existingNews: NewsItem[] = existingNewsStr ? JSON.parse(existingNewsStr) : [];
      
      // Track new articles
      let newArticlesCount = 0;
      const allNews = [...existingNews];
      const categories: NewsCategory[] = ['ai', 'robotics', 'biotech'];
      
      // Process each source
      for (const source of sources) {
        try {
          for (const category of categories) {
            try {
              // Fetch news using Perplexity
              const newsItems = await PerplexitySearchService.searchNewsFromSource(source, category);
              
              // Add non-duplicate items to allNews
              for (const item of newsItems) {
                // Check if article with same URL already exists
                const isDuplicate = existingNews.some(existingItem => existingItem.url === item.url);
                
                if (!isDuplicate) {
                  allNews.push(item);
                  newArticlesCount++;
                }
              }
            } catch (categoryError) {
              console.error(`Error fetching ${category} news from ${source.name}:`, categoryError);
              // Continue with other categories
            }
          }
        } catch (sourceError) {
          console.error(`Error fetching news from source ${source.name}:`, sourceError);
          // Continue with other sources
        }
      }
      
      // Update localStorage with new articles
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(allNews));
      
      // Update last fetch time
      localStorage.setItem(STORAGE_KEYS.LAST_FETCH, new Date().toISOString());
      
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
   * Makes sure we have at least the dummy news if nothing else
   */
  private static ensureDummyNews(): void {
    const newsStr = localStorage.getItem(STORAGE_KEYS.NEWS);
    if (!newsStr) {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(dummyNews));
      console.log('Dummy news added to localStorage');
    }
  }
  
  /**
   * Manual trigger for news fetch
   */
  static async refreshNews(): Promise<FetchNewsResult> {
    return await this.fetchNews();
  }
}

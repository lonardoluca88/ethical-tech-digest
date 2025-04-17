
import { NewsItem, NewsCategory, NewsSource } from '@/lib/types';
import { dummyNews } from '@/lib/dummyData';

const STORAGE_KEYS = {
  NEWS: 'ethicalTechDigest_news',
  SOURCES: 'ethicalTechDigest_sources',
  LAST_FETCH: 'ethicalTechDigest_lastFetch'
};

const KEYWORDS = {
  ai: ['artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'AI ethics', 'generative AI', 'large language model', 'LLM'],
  robotics: ['robotics', 'automation', 'autonomous', 'robot', 'drone', 'robot ethics', 'robotic process', 'human-robot interaction'],
  biotech: ['biotechnology', 'genomics', 'crispr', 'genetic engineering', 'bioethics', 'synthetic biology', 'gene editing', 'biotech ethics']
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
   * Fetches news from sources and updates storage
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
      
      // Get existing news
      const existingNewsStr = localStorage.getItem(STORAGE_KEYS.NEWS);
      const existingNews: NewsItem[] = existingNewsStr ? JSON.parse(existingNewsStr) : [];
      
      // Track new articles
      let newArticlesCount = 0;
      const allNews = [...existingNews];
      
      // Process each source
      for (const source of sources) {
        try {
          const articles = await this.fetchNewsFromSource(source);
          
          // Filter out duplicates and add new articles
          for (const article of articles) {
            const isDuplicate = existingNews.some(
              existingArticle => 
                existingArticle.title === article.title || 
                existingArticle.url === article.url
            );
            
            if (!isDuplicate) {
              allNews.push(article);
              newArticlesCount++;
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
   * Fetches news from a specific source
   * This is where you'd integrate with real news APIs
   */
  private static async fetchNewsFromSource(source: NewsSource): Promise<NewsItem[]> {
    // Simulating API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get current date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    // Create random number of articles (1-3)
    const articleCount = Math.floor(Math.random() * 3) + 1;
    const articles: NewsItem[] = [];
    
    // Generate some random articles based on source and categories
    for (let i = 0; i < articleCount; i++) {
      // Pick a random category
      const categories: NewsCategory[] = ['ai', 'robotics', 'biotech'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      // Pick a random keyword for that category
      const categoryKeywords = KEYWORDS[randomCategory];
      const keyword = categoryKeywords[Math.floor(Math.random() * categoryKeywords.length)];
      
      articles.push({
        id: crypto.randomUUID(),
        title: `New developments in ${keyword} research`,
        summary: `Recent breakthroughs in ${keyword} are changing how we approach ${randomCategory} problems.`,
        content: `This is a simulated article about ${keyword} in the field of ${randomCategory}. In the real implementation, this would be actual content from news sources.`,
        url: `https://${source.url}/articles/${dateStr}/${keyword.replace(/\s+/g, '-')}`,
        date: dateStr,
        sourceId: source.id,
        category: randomCategory,
        imageUrl: `https://picsum.photos/seed/${keyword.replace(/\s+/g, '')}/400/300`
      });
    }
    
    return articles;
  }
  
  /**
   * Manual trigger for news fetch
   */
  static async refreshNews(): Promise<FetchNewsResult> {
    return await this.fetchNews();
  }
}

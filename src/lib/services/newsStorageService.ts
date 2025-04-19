
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
  
  /**
   * Pulisce l'archivio notizie
   */
  static clearNewsArchive(): void {
    localStorage.removeItem(STORAGE_KEYS.NEWS);
    localStorage.removeItem(STORAGE_KEYS.LAST_FETCH); // Rimuovere anche l'ultimo timestamp di fetch
    console.log('Archivio notizie e timestamp svuotati completamente');
  }

  /**
   * Verifica se una notizia è già presente nell'archivio
   */
  static isDuplicate(newItem: NewsItem, existingItems: NewsItem[]): boolean {
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
  static normalizeUrl(url: string): string {
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
  static normalizeTitle(title: string): string {
    return title.toLowerCase().trim().replace(/\s+/g, ' ');
  }
  
  /**
   * Calcola la similarità tra due stringhe (0-1)
   * Usa una versione semplificata di Jaccard similarity
   */
  static calculateSimilarity(str1: string, str2: string): number {
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
}

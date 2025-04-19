
/**
 * Service per gestire le chiavi API in modo sicuro
 * con supporto per localStorage come fallback
 */

import { supabase } from '@/lib/supabaseClient';

// Chiave per localStorage
const PERPLEXITY_API_KEY_STORAGE = 'ethical_tech_digest_perplexity_key';

export class ApiKeyService {
  private static apiKey: string | null = null;
  
  /**
   * Imposta una chiave API tramite Edge Function con fallback a localStorage
   */
  static async setApiKey(key: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('set-perplexity-key', {
        body: { key }
      });
      
      if (error) {
        throw new Error('Errore nel salvare l\'API key: ' + error.message);
      }
      
      this.apiKey = key;
    } catch (error) {
      // Fallback a localStorage se la funzione Edge fallisce
      this.setLocalApiKey(key);
      console.log('Chiave API salvata localmente come fallback');
      // Non rilanciamo l'errore per permettere il funzionamento in modalità fallback
    }
  }
  
  /**
   * Imposta la chiave direttamente nel localStorage
   */
  static setLocalApiKey(key: string): void {
    localStorage.setItem(PERPLEXITY_API_KEY_STORAGE, key);
    this.apiKey = key;
  }
  
  /**
   * Recupera la chiave API da Supabase o localStorage
   */
  static async getApiKey(): Promise<string | null> {
    // Se abbiamo già la chiave in memoria, la restituiamo
    if (this.apiKey) return this.apiKey;
    
    try {
      // Prova prima da Supabase
      const { data, error } = await supabase.functions.invoke('get-perplexity-key');
      
      if (error) {
        // Se c'è un errore, prova da localStorage
        const localKey = localStorage.getItem(PERPLEXITY_API_KEY_STORAGE);
        
        if (localKey) {
          this.apiKey = localKey;
          return localKey;
        }
        
        console.warn('Errore nell\'ottenere la chiave API e nessuna chiave in localStorage');
        return null;
      }
      
      if (data?.key) {
        this.apiKey = data.key;
        return data.key;
      }
      
      // Se non c'è la chiave su Supabase, prova da localStorage
      const localKey = localStorage.getItem(PERPLEXITY_API_KEY_STORAGE);
      
      if (localKey) {
        this.apiKey = localKey;
        return localKey;
      }
      
      return null;
    } catch (error) {
      // Se fallisce la chiamata, prova da localStorage
      const localKey = localStorage.getItem(PERPLEXITY_API_KEY_STORAGE);
      
      if (localKey) {
        this.apiKey = localKey;
        return localKey;
      }
      
      console.warn('Errore nel recuperare l\'API key:', error);
      return null;
    }
  }
  
  /**
   * Cancella la chiave API da Supabase e localStorage
   */
  static async clearApiKey(): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('clear-perplexity-key');
      
      if (error) {
        throw new Error('Errore nella rimozione dell\'API key: ' + error.message);
      }
    } catch (error) {
      console.warn('Errore nella rimozione dell\'API key da Supabase:', error);
    } finally {
      // In ogni caso, rimuoviamo la chiave dal localStorage
      this.clearLocalApiKey();
    }
  }
  
  /**
   * Cancella la chiave API dal localStorage
   */
  static clearLocalApiKey(): void {
    localStorage.removeItem(PERPLEXITY_API_KEY_STORAGE);
    this.apiKey = null;
  }
}

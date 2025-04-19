
// Questo è un proxy file per utilizzare il client ufficiale Supabase
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Esporta il client Supabase per l'uso nell'applicazione
export const supabase = supabaseClient;

// Aggiungi un'utilità per verificare se le Edge Functions sono disponibili
export async function checkEdgeFunctionsAvailability(): Promise<boolean> {
  try {
    const startTime = Date.now();
    // Prova a chiamare una funzione edge semplice
    const { error } = await supabase.functions.invoke('get-perplexity-key');
    const endTime = Date.now();
    
    // Se il tempo di risposta è inferiore a 5 secondi e non ci sono errori, le funzioni sono probabilmente disponibili
    return !error && (endTime - startTime < 5000);
  } catch (error) {
    console.warn('Edge Functions non disponibili:', error);
    return false;
  }
}

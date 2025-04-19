
import { NewsCategory, NewsSource } from '@/lib/types';
import { getCategoryName, getCategoryKeywords } from './categoryUtils';

export const generateSearchPrompt = (source: NewsSource, category: NewsCategory): string => {
  const keywords = getCategoryKeywords(category);
  const keywordsStr = keywords.join(', ');
  
  return `
    Trova notizie molto recenti (preferibilmente degli ultimi 2-3 giorni, massimo 7 giorni) riguardanti i risvolti etici della tecnologia, 
    specificamente nel campo della ${getCategoryName(category)} (${keywordsStr}) 
    dal sito ${source.url}.
    
    Concentrati su notizie nuove e rilevanti che discutono esplicitamente di etica, implicazioni sociali, regolamentazione o impatti sulla società
    in relazione alla ${getCategoryName(category)}. Cerca articoli diversi da quelli che potresti aver già trovato in passato.
    
    Trova al massimo 3 notizie che soddisfano questi criteri.
    
    Per ogni notizia fornisci le seguenti informazioni in formato JSON:
    - title: il titolo esatto dell'articolo
    - url: l'URL completo e funzionante dell'articolo
    - summary: un breve riassunto dell'articolo in italiano (massimo 200 caratteri) che evidenzi gli aspetti etici
    - date: la data di pubblicazione in formato YYYY-MM-DD (usa la data più recente possibile)
    
    Rispondi SOLO con un array JSON valido contenente gli oggetti delle notizie, nient'altro.
  `;
};


import { NewsCategory, NewsSource } from '@/lib/types';
import { getCategoryName, getCategoryKeywords } from './categoryUtils';

export const generateSearchPrompt = (source: NewsSource, category: NewsCategory): string => {
  const keywords = getCategoryKeywords(category);
  const keywordsStr = keywords.join(', ');
  
  return `
    Trova notizie MOLTO RECENTI (degli ultimi 7 giorni, idealmente 2-3 giorni) riguardanti i risvolti etici della tecnologia, 
    specificamente nel campo della ${getCategoryName(category)} (${keywordsStr}) 
    dal sito ${source.url}.
    
    Concentrati ESCLUSIVAMENTE su notizie nuove e rilevanti che discutono esplicitamente di etica, implicazioni sociali, 
    regolamentazione o impatti sulla società in relazione alla ${getCategoryName(category)}.
    
    È FONDAMENTALE che fornisci articoli diversi da quelli già trovati in passato e che siano il più recenti possibile.
    
    È CRUCIALE che ogni URL fornito sia COMPLETO (inizia con http:// o https://) e FUNZIONANTE.
    DEVI VERIFICARE che ogni URL sia accessibile e porti direttamente all'articolo citato.
    NON fornire URL parziali o homepage generiche del sito.
    
    Trova al massimo 3 notizie che soddisfano questi criteri.
    
    Per ogni notizia fornisci le seguenti informazioni in formato JSON:
    - title: il titolo esatto dell'articolo
    - url: l'URL completo e funzionante dell'articolo (VERIFICA CHE QUESTO URL SIA CORRETTO E FUNZIONANTE)
    - summary: un breve riassunto dell'articolo in italiano (massimo 200 caratteri) che evidenzi gli aspetti etici
    - date: la data di pubblicazione in formato YYYY-MM-DD (usa la data più recente possibile)
    
    È CRUCIALE che tu risponda SOLO con un array JSON valido contenente gli oggetti delle notizie, nient'altro.
    VERIFICA ATTENTAMENTE ogni URL prima di includerlo nella risposta per assicurarti che sia completo e funzionante.
  `;
};

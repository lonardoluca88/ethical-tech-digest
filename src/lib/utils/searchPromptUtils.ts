
import { NewsCategory, NewsSource } from '@/lib/types';
import { getCategoryName, getCategoryKeywords } from './categoryUtils';

export const generateSearchPrompt = (source: NewsSource, category: NewsCategory): string => {
  const keywords = getCategoryKeywords(category);
  const keywordsStr = keywords.join(', ');
  
  return `
    Cerca notizie recenti (massimo degli ultimi 7 giorni) riguardanti i risvolti etici della tecnologia, 
    specificamente nel campo della ${getCategoryName(category)} (${keywordsStr}) 
    dal sito ${source.url}.
    
    Trova al massimo 3 notizie rilevanti che discutono in qualche modo di etica e ${getCategoryName(category)}.
    
    Per ogni notizia fornisci le seguenti informazioni in formato JSON:
    - title: il titolo dell'articolo
    - url: l'URL completo dell'articolo
    - summary: un breve riassunto dell'articolo in italiano (massimo 200 caratteri) che menzioni gli aspetti etici
    - date: la data di pubblicazione in formato YYYY-MM-DD
    
    Rispondi SOLO con un array JSON valido contenente gli oggetti delle notizie, nient'altro.
  `;
};

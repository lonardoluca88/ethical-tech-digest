
import { NewsCategory, NewsSource } from '@/lib/types';
import { getCategoryName, getCategoryKeywords } from './categoryUtils';

export const generateSearchPrompt = (source: NewsSource, category: NewsCategory): string => {
  const keywords = getCategoryKeywords(category);
  const keywordsStr = keywords.join(', ');
  
  return `
    Trova notizie ESTREMAMENTE RECENTI (degli ultimi 7 giorni, preferibilmente ultime 48 ore) riguardanti i risvolti etici della tecnologia, 
    specificamente nel campo della ${getCategoryName(category)} (${keywordsStr}) 
    dal sito ${source.url}.
    
    Concentrati ESCLUSIVAMENTE su notizie nuove e rilevanti che discutono esplicitamente di etica, implicazioni sociali, 
    regolamentazione o impatti sulla società in relazione alla ${getCategoryName(category)}.
    
    È VITALE che ogni URL sia COMPLETO, FUNZIONANTE e DIRETTO all'articolo specifico.
    Ogni URL DEVE:
    - Iniziare con http:// o https://
    - Contenere il nome di dominio completo
    - Puntare direttamente alla pagina dell'articolo, non alla homepage o a sezioni generali
    - Essere stato verificato come accessibile
    
    È FONDAMENTALE che fornisci articoli diversi da quelli già trovati in passato e che siano il più recenti possibile.
    
    NON ABBREVIARE gli URL. Non fornire versioni troncate o semplificate. Fornisci sempre l'URL completo esattamente come appare nel browser.
    
    Trova al massimo 3 notizie che soddisfano questi criteri.
    
    Per ogni notizia fornisci le seguenti informazioni in formato JSON:
    - title: il titolo esatto dell'articolo
    - url: l'URL completo, verificato e funzionante dell'articolo (ASSOLUTAMENTE NON TRONCATO)
    - summary: un breve riassunto dell'articolo in italiano (massimo 200 caratteri) che evidenzi gli aspetti etici
    - date: la data di pubblicazione in formato YYYY-MM-DD (usa la data più recente possibile)
    
    È CRUCIALE che tu risponda SOLO con un array JSON valido contenente gli oggetti delle notizie, nient'altro.
    Verifica ogni URL prima di includerlo per assicurarti che sia:
    1. Completo (non troncato)
    2. Funzionante (accessibile)
    3. Diretto all'articolo specifico
  `;
};

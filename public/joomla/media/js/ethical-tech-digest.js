
/**
 * Ethical Tech Digest Widget Loader
 *
 * @copyright   Copyright (C) 2025 All rights reserved.
 * @license     GNU General Public License version 2 or later;
 */
(function() {
  // Configurazione widget
  const defaultConfig = {
    theme: 'light',
    categories: ['ai', 'robotics', 'biotech']
  };
  
  // Logger personalizzato
  const logger = {
    info: function(msg, data) {
      console.log(`[ETD Widget] ${msg}`, data || '');
    },
    error: function(msg, err) {
      console.error(`[ETD Widget Error] ${msg}`, err || '');
    },
    warn: function(msg, data) {
      console.warn(`[ETD Widget Warning] ${msg}`, data || '');
    }
  };
  
  // Funzione per caricare il widget
  window.loadEthicalTechWidget = function(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      logger.error(`Nessun elemento con ID "${containerId}" trovato.`);
      return;
    }
    
    try {
      // Leggi la configurazione
      const theme = options.theme || container.getAttribute('data-theme') || defaultConfig.theme;
      const categoriesAttr = options.categories || container.getAttribute('data-categories');
      const categories = categoriesAttr ? categoriesAttr.split(',') : defaultConfig.categories;
      const height = options.height || '600';
      
      logger.info('Configurazione widget:', { theme, categories, height });
      
      // Determina la base URL
      const baseUrl = 'https://leonardo2030.entourage-di-kryon.it/lovablenews/';
      
      // Costruisci l'URL con i parametri di configurazione
      const url = new URL(baseUrl);
      url.searchParams.append('theme', theme);
      url.searchParams.append('categories', categories.join(','));
      url.searchParams.append('t', new Date().getTime()); // Previene caching
      
      // Crea l'iframe
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = height + 'px';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.setAttribute('title', 'Ethical Tech Digest');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('src', url.toString());
      
      // Pulisci container e aggiungi l'iframe
      container.innerHTML = '';
      container.appendChild(iframe);
      
      return iframe;
    } catch (error) {
      logger.error('Errore durante l\'inizializzazione del widget:', error);
      container.innerHTML = '<div style="padding:15px; background-color:#FEE2E2; border:1px solid #F87171; border-radius:4px; color:#B91C1C;">Impossibile caricare il widget. Per favore ricarica la pagina.</div>';
      return null;
    }
  };
})();

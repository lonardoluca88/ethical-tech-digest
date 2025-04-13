
/**
 * Ethical Tech Digest Widget JavaScript
 * 
 * @package    mod_ethical_tech_digest
 * @copyright  Copyright (C) 2025 All rights reserved.
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
    }
  };
  
  function loadWidget(containerId) {
    // Trova il contenitore del widget
    const container = document.getElementById(containerId);
    if (!container) {
      logger.error('Contenitore non trovato: ' + containerId);
      return;
    }
    
    try {
      // Leggi la configurazione
      const theme = container.getAttribute('data-theme') || defaultConfig.theme;
      const categoriesAttr = container.getAttribute('data-categories');
      const categories = categoriesAttr ? categoriesAttr.split(',') : defaultConfig.categories;
      
      // Base URL del widget
      const baseUrl = 'https://leonardo2030.entourage-di-kryon.it/lovablenews/';
      
      // Costruisci l'URL con i parametri di configurazione
      const url = new URL(baseUrl);
      url.searchParams.append('theme', theme);
      url.searchParams.append('categories', categories.join(','));
      url.searchParams.append('t', new Date().getTime()); // Previene caching
      
      // IMPORTANTE: Utilizzo diretto del metodo iframe che funziona nei test
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '600px';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.setAttribute('title', 'Ethical Tech Digest');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('src', url.toString());
      
      // Pulisci container e aggiungi l'iframe
      container.innerHTML = '';
      container.appendChild(iframe);
      
    } catch (error) {
      logger.error('Errore durante l\'inizializzazione del widget:', error);
      container.innerHTML = '<div style="padding:15px; background-color:#FEE2E2; border:1px solid #F87171; border-radius:4px; color:#B91C1C;">Impossibile caricare il widget. Per favore ricarica la pagina.</div>';
    }
  }
  
  // Esponi funzione globale per permettere l'inizializzazione manuale
  window.initEthicalTechWidget = function(containerId) {
    if (containerId) {
      loadWidget(containerId);
    } else {
      // Cerca tutti i contenitori con classe 'ethical-tech-digest-widget'
      const containers = document.querySelectorAll('.ethical-tech-digest-widget');
      containers.forEach(container => {
        loadWidget(container.id);
      });
    }
  };
  
  // Inizializza automaticamente quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.initEthicalTechWidget();
    });
  } else {
    window.initEthicalTechWidget();
  }
})();

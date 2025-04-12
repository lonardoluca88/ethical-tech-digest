
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
  
  // Aggiungiamo uno status visibile all'utente
  function createStatusMessage(container, message, isError = false) {
    logger.info(`Creazione messaggio di stato: ${message}, isError: ${isError}`);
    
    const statusEl = document.createElement('div');
    statusEl.style.padding = '15px';
    statusEl.style.margin = '10px 0';
    statusEl.style.borderRadius = '4px';
    statusEl.style.fontSize = '14px';
    
    if (isError) {
      statusEl.style.backgroundColor = '#FEE2E2';
      statusEl.style.color = '#B91C1C';
      statusEl.style.border = '1px solid #F87171';
    } else {
      statusEl.style.backgroundColor = '#F3F4F6';
      statusEl.style.color = '#374151';
      statusEl.style.border = '1px solid #D1D5DB';
    }
    
    statusEl.textContent = message;
    container.appendChild(statusEl);
    
    return statusEl;
  }
  
  function loadWidget() {
    // Trova il contenitore del widget
    const container = document.getElementById('ethical-tech-digest');
    if (!container) {
      logger.error('Nessun elemento con ID "ethical-tech-digest" trovato.');
      return;
    }
    
    // Mostra messaggio di caricamento
    logger.info('Inizializzazione widget...');
    const statusEl = createStatusMessage(container, 'Caricamento del widget in corso...');
    
    try {
      // Leggi la configurazione
      const theme = container.getAttribute('data-theme') || defaultConfig.theme;
      const categoriesAttr = container.getAttribute('data-categories');
      const categories = categoriesAttr ? categoriesAttr.split(',') : defaultConfig.categories;
      
      logger.info('Configurazione widget:', { theme, categories });
      
      // Determina il percorso base in modo dinamico
      const scriptTags = document.getElementsByTagName('script');
      let baseUrl = 'https://leonardo2030.entourage-di-kryon.it/lovablenews/';
      let scriptFound = false;
      
      // Cerca lo script corrente per determinare il baseUrl
      for (let i = 0; i < scriptTags.length; i++) {
        const src = scriptTags[i].src || '';
        if (src.includes('ethical-tech-digest.js')) {
          baseUrl = src.substring(0, src.lastIndexOf('/widget/')) + '/';
          logger.info('Base URL rilevato:', baseUrl);
          scriptFound = true;
          break;
        }
      }
      
      if (!scriptFound) {
        logger.warn('Script ethical-tech-digest.js non trovato nei tag script. Usando URL fallback.');
      }
      
      // Costruisci l'URL con i parametri di configurazione
      const url = new URL(baseUrl);
      url.searchParams.append('theme', theme);
      url.searchParams.append('categories', categories.join(','));
      url.searchParams.append('t', new Date().getTime()); // Previene caching
      
      logger.info('URL iframe:', url.toString());
      
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
      
      // Rimuovi messaggio di caricamento dopo un po'
      setTimeout(() => {
        if (statusEl && statusEl.parentNode === container) {
          container.removeChild(statusEl);
        }
      }, 1000);
      
      // Gestisci il ridimensionamento dinamico dell'iframe
      window.addEventListener('message', function(event) {
        // Verifica l'origine se necessario
        if (event.data && event.data.type === 'resize' && event.data.height) {
          logger.info('Ricevuto evento resize:', event.data);
          iframe.style.height = event.data.height + 'px';
        }
      });
      
    } catch (error) {
      logger.error('Errore durante l\'inizializzazione del widget:', error);
      createStatusMessage(container, 'Si è verificato un errore. Utilizzo metodo alternativo...', true);
      
      // Fallback al metodo alternativo di iframe che sappiamo funzionare
      setTimeout(() => {
        try {
          const theme = container.getAttribute('data-theme') || defaultConfig.theme;
          const categoriesAttr = container.getAttribute('data-categories');
          const categories = categoriesAttr ? categoriesAttr.split(',') : defaultConfig.categories;
          
          const fallbackUrl = `https://leonardo2030.entourage-di-kryon.it/lovablenews/?theme=${theme}&categories=${categories.join(',')}&t=${new Date().getTime()}`;
          
          container.innerHTML = `<iframe src="${fallbackUrl}" style="width:100%; height:600px; border:none; overflow:hidden;" title="Ethical Tech Digest"></iframe>`;
          logger.info('Utilizzato fallback iframe:', fallbackUrl);
        } catch(e) {
          logger.error('Errore anche nel fallback:', e);
          container.innerHTML = '<div style="padding:15px; background-color:#FEE2E2; border:1px solid #F87171; border-radius:4px; color:#B91C1C;">Impossibile caricare il widget. Per favore ricarica la pagina.</div>';
        }
      }, 1000);
    }
  }
  
  // Esegui il caricamento quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
  
  // Esponi una funzione per ricaricare il widget
  window.reloadEthicalTechWidget = function() {
    const container = document.getElementById('ethical-tech-digest');
    if (container) {
      container.innerHTML = '';
      loadWidget();
    }
  };
})();

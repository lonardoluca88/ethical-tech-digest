
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
      
      // Aggiungiamo un messaggio di debug aggiuntivo
      createStatusMessage(container, `Utilizzo base URL: ${baseUrl}`, false);
      
      // Memorizza la posizione attuale prima di creare l'iframe
      const hostUrl = window.location.href;
      logger.info('Host URL:', hostUrl);
      
      // Crea l'iframe
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '600px';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.setAttribute('title', 'Ethical Tech Digest');
      iframe.setAttribute('loading', 'lazy');
      
      // Costruisci l'URL con i parametri di configurazione
      const url = new URL(baseUrl);
      url.searchParams.append('theme', theme);
      url.searchParams.append('categories', categories.join(','));
      url.searchParams.append('t', new Date().getTime()); // Previene caching
      
      logger.info('URL iframe:', url.toString());
      
      // Evento onload per l'iframe
      iframe.onload = function() {
        logger.info('iframe caricato con successo');
        // Rimuovi il messaggio di stato
        if (statusEl && statusEl.parentNode) {
          statusEl.parentNode.removeChild(statusEl);
        }
      };
      
      // Evento onerror per l'iframe
      iframe.onerror = function(err) {
        logger.error('Errore nel caricamento dell\'iframe:', err);
        createStatusMessage(container, 'Errore nel caricamento del widget. Per favore ricarica la pagina.', true);
      };
      
      // Debug info sul tipo di ambiente
      if (window.location.href.includes('gpteng.co') || window.location.href.includes('lovableproject.com')) {
        logger.info('Ambiente di sviluppo rilevato');
        createStatusMessage(container, 'Ambiente di sviluppo rilevato. Il widget potrebbe comportarsi diversamente in produzione.', false);
      }
      
      // Imposta l'attributo src dopo aver definito gli handler
      iframe.setAttribute('src', url.toString());
      
      // Aggiungi l'iframe al contenitore (mantenendo il messaggio di stato per ora)
      container.appendChild(iframe);
      
      // Gestisci il ridimensionamento dinamico dell'iframe
      window.addEventListener('message', function(event) {
        // Verifica l'origine se necessario
        logger.info('Messaggio ricevuto:', event.data);
        
        if (event.data && event.data.type === 'resize' && event.data.height) {
          logger.info('Ricevuto evento resize:', event.data);
          iframe.style.height = event.data.height + 'px';
        }
      });
      
      // Verifica se l'iframe è stato caricato dopo un timeout
      setTimeout(function() {
        try {
          // Prova ad accedere al contenuto dell'iframe per verificare se è stato caricato
          // Questo potrebbe fallire per la policy di same-origin
          const iframeContent = iframe.contentWindow.document;
          logger.info('Iframe verificato dopo timeout');
        } catch (e) {
          logger.info('Non posso verificare il contenuto dell\'iframe a causa della same-origin policy');
          
          // Verifica visivamente se l'iframe ha contenuto
          if (iframe.offsetHeight < 50) {
            logger.warn('Iframe sembra vuoto (altezza < 50px)');
            createStatusMessage(container, 'Il widget non sembra essere caricato correttamente. Prova con il metodo alternativo.', true);
            
            // Aggiungere pulsanti di azione
            const actionsDiv = document.createElement('div');
            actionsDiv.style.marginTop = '10px';
            
            // Pulsante per ricaricare
            const reloadBtn = document.createElement('button');
            reloadBtn.textContent = 'Riprova';
            reloadBtn.style.marginRight = '10px';
            reloadBtn.style.padding = '8px 16px';
            reloadBtn.style.backgroundColor = '#2563EB';
            reloadBtn.style.color = 'white';
            reloadBtn.style.border = 'none';
            reloadBtn.style.borderRadius = '4px';
            reloadBtn.style.cursor = 'pointer';
            
            reloadBtn.onclick = function() {
              window.reloadEthicalTechWidget();
            };
            
            // Pulsante per metodo alternativo
            const altBtn = document.createElement('button');
            altBtn.textContent = 'Usa metodo alternativo';
            altBtn.style.padding = '8px 16px';
            altBtn.style.backgroundColor = '#6B7280';
            altBtn.style.color = 'white';
            altBtn.style.border = 'none';
            altBtn.style.borderRadius = '4px';
            altBtn.style.cursor = 'pointer';
            
            altBtn.onclick = function() {
              if (typeof testAlternative === 'function') {
                testAlternative();
              } else {
                const container = document.getElementById('ethical-tech-digest');
                container.innerHTML = '<iframe src="' + baseUrl + '?theme=' + theme + '&categories=' + categories.join(',') + '" style="width:100%; height:600px; border:none;"></iframe>';
              }
            };
            
            actionsDiv.appendChild(reloadBtn);
            actionsDiv.appendChild(altBtn);
            container.appendChild(actionsDiv);
          }
        }
      }, 5000);
      
    } catch (error) {
      logger.error('Errore durante l\'inizializzazione del widget:', error);
      createStatusMessage(container, 'Si è verificato un errore: ' + error.message, true);
      
      // Aggiungi info aggiuntive sull'errore
      const errorDetails = document.createElement('pre');
      errorDetails.style.backgroundColor = '#FEF2F2';
      errorDetails.style.padding = '10px';
      errorDetails.style.borderRadius = '4px';
      errorDetails.style.fontSize = '12px';
      errorDetails.style.overflow = 'auto';
      errorDetails.style.maxHeight = '200px';
      errorDetails.textContent = error.stack || 'Nessun dettaglio disponibile';
      container.appendChild(errorDetails);
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

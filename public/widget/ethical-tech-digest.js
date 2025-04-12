
(function() {
  // Configurazione widget
  const defaultConfig = {
    theme: 'light',
    categories: ['ai', 'robotics', 'biotech']
  };
  
  // Aggiungiamo uno status visibile all'utente
  function createStatusMessage(container, message, isError = false) {
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
    
    // Log anche in console per debugging
    console.log(`Widget status: ${message}`);
    
    return statusEl;
  }
  
  function loadWidget() {
    // Trova il contenitore del widget
    const container = document.getElementById('ethical-tech-digest');
    if (!container) {
      console.error('Ethical Tech Digest: nessun elemento con ID "ethical-tech-digest" trovato.');
      return;
    }
    
    // Mostra messaggio di caricamento
    const statusEl = createStatusMessage(container, 'Caricamento del widget in corso...');
    
    try {
      // Leggi la configurazione
      const theme = container.getAttribute('data-theme') || defaultConfig.theme;
      const categoriesAttr = container.getAttribute('data-categories');
      const categories = categoriesAttr ? categoriesAttr.split(',') : defaultConfig.categories;
      
      console.log('Configurazione widget:', { theme, categories });
      
      // Determina il percorso base in modo dinamico
      const scriptTags = document.getElementsByTagName('script');
      let baseUrl = 'https://leonardo2030.entourage-di-kryon.it/lovablenews/';
      
      // Cerca lo script corrente per determinare il baseUrl
      for (let i = 0; i < scriptTags.length; i++) {
        const src = scriptTags[i].src || '';
        if (src.includes('ethical-tech-digest.js')) {
          baseUrl = src.substring(0, src.lastIndexOf('/widget/')) + '/';
          console.log('Base URL rilevato:', baseUrl);
          break;
        }
      }
      
      // Crea l'iframe con una fallback URL
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
      
      console.log('URL iframe:', url.toString());
      
      // Evento onload per l'iframe
      iframe.onload = function() {
        console.log('iframe caricato con successo');
        // Rimuovi il messaggio di stato
        if (statusEl && statusEl.parentNode) {
          statusEl.parentNode.removeChild(statusEl);
        }
      };
      
      // Evento onerror per l'iframe
      iframe.onerror = function(err) {
        console.error('Errore nel caricamento dell\'iframe:', err);
        createStatusMessage(container, 'Errore nel caricamento del widget. Per favore ricarica la pagina.', true);
      };
      
      // Imposta l'attributo src dopo aver definito gli handler
      iframe.setAttribute('src', url.toString());
      
      // Aggiungi l'iframe al contenitore (mantenendo il messaggio di stato per ora)
      container.appendChild(iframe);
      
      // Gestisci il ridimensionamento dinamico dell'iframe
      window.addEventListener('message', function(event) {
        // Verifica l'origine se necessario
        
        if (event.data && event.data.type === 'resize' && event.data.height) {
          console.log('Ricevuto evento resize:', event.data);
          iframe.style.height = event.data.height + 'px';
        }
      });
      
      // Verifica se l'iframe è stato caricato dopo un timeout
      setTimeout(function() {
        try {
          // Prova ad accedere al contenuto dell'iframe per verificare se è stato caricato
          // Questo potrebbe fallire per la policy di same-origin
          const iframeContent = iframe.contentWindow.document;
          console.log('Iframe verificato dopo timeout');
        } catch (e) {
          console.log('Non posso verificare il contenuto dell\'iframe a causa della same-origin policy');
          
          // Aggiungi un pulsante di fallback per ricaricare
          const reloadBtn = document.createElement('button');
          reloadBtn.textContent = 'Ricarica Widget';
          reloadBtn.style.marginTop = '10px';
          reloadBtn.style.padding = '8px 16px';
          reloadBtn.style.backgroundColor = '#2563EB';
          reloadBtn.style.color = 'white';
          reloadBtn.style.border = 'none';
          reloadBtn.style.borderRadius = '4px';
          reloadBtn.style.cursor = 'pointer';
          
          reloadBtn.onclick = function() {
            window.location.reload();
          };
          
          if (!document.querySelector('.ethical-tech-reload-btn')) {
            reloadBtn.className = 'ethical-tech-reload-btn';
            container.appendChild(reloadBtn);
          }
        }
      }, 5000);
      
    } catch (error) {
      console.error('Errore durante l\'inizializzazione del widget:', error);
      createStatusMessage(container, 'Si è verificato un errore: ' + error.message, true);
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

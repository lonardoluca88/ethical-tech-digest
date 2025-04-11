
(function() {
  // Configurazione widget
  const defaultConfig = {
    theme: 'light',
    categories: ['ai', 'robotics', 'biotech']
  };
  
  function loadWidget() {
    // Trova il contenitore del widget
    const container = document.getElementById('ethical-tech-digest');
    if (!container) {
      console.error('Ethical Tech Digest: nessun elemento con ID "ethical-tech-digest" trovato.');
      return;
    }
    
    // Leggi la configurazione
    const theme = container.getAttribute('data-theme') || defaultConfig.theme;
    const categoriesAttr = container.getAttribute('data-categories');
    const categories = categoriesAttr ? categoriesAttr.split(',') : defaultConfig.categories;
    
    // Crea l'iframe
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.minHeight = '600px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.setAttribute('title', 'Ethical Tech Digest');
    iframe.setAttribute('loading', 'lazy');
    
    // Costruisci l'URL con i parametri di configurazione
    const baseUrl = 'https://leonardo2030.entourage-di-kryon.it/lovablenews/';
    const url = new URL(baseUrl);
    url.searchParams.append('theme', theme);
    url.searchParams.append('categories', categories.join(','));
    
    iframe.setAttribute('src', url.toString());
    
    // Aggiungi l'iframe al contenitore
    container.innerHTML = '';
    container.appendChild(iframe);
    
    // Gestisci il ridimensionamento dinamico dell'iframe
    window.addEventListener('message', function(event) {
      if (event.origin !== 'https://leonardo2030.entourage-di-kryon.it') return;
      
      if (event.data && event.data.type === 'resize' && event.data.height) {
        iframe.style.height = event.data.height + 'px';
      }
    });
  }
  
  // Esegui il caricamento quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
})();


# Ethical Tech Digest Widget

Questo repository contiene il codice sorgente del widget Ethical Tech Digest, progettato per visualizzare notizie sui risvolti etici delle nuove tecnologie.

## Struttura del progetto

- `src/`: Codice sorgente React dell'applicazione
- `public/`: File statici e widget standalone
- `public/widget/`: Script per l'incorporamento del widget in altri siti

## Deployment

### Prerequisiti

- Accesso FTP al server web
- Sottodominio configurato (es. `https://news.entourage-di-kryon.it`)

### Istruzioni per il deployment

1. Costruisci l'applicazione per la produzione:

```bash
npm run build
```

2. Carica tutti i file dalla directory `dist/` nella root del sottodominio tramite FileZilla

3. Assicurati che il server web sia configurato per gestire le SPA (Single-Page Applications):
   
   Per Apache, crea o modifica un file `.htaccess` nella root con:
   
   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

   Per Nginx, configura il server block come:
   
   ```
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

4. Verifica che il widget funzioni aprendo il sottodominio nel browser

### Test del widget incorporato

Per testare l'incorporamento del widget in altri siti:

1. Crea una pagina HTML di test con il seguente codice:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Widget</title>
  <style>body { max-width: 1000px; margin: 0 auto; padding: 20px; }</style>
</head>
<body>
  <h1>Test del Widget Ethical Tech Digest</h1>
  
  <iframe 
    src="http://news.entourage-di-kryon.it/?theme=light&categories=ai,robotics,biotech" 
    width="100%" 
    height="800" 
    frameborder="0" 
    title="Ethical Tech Digest">
  </iframe>
</body>
</html>
```

2. Apri questo file HTML in un browser per verificare che il widget venga caricato correttamente

## Supporto

Per assistenza o informazioni aggiuntive, contatta:
supporto@entourage-di-kryon.it


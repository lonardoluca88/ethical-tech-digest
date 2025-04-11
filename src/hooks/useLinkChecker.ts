
import { useState, useEffect } from 'react';

export const useLinkChecker = (url: string) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLink = async () => {
      if (!url) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Utilizziamo un proxy CORS per evitare problemi di cross-origin
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const encodedUrl = encodeURIComponent(url);
        
        const response = await fetch(`${proxyUrl}${encodedUrl}`);
        const data = await response.json();
        
        // Verifichiamo il codice di stato della risposta
        setIsValid(data.status?.http_code === 200);
        setIsLoading(false);
      } catch (error) {
        console.error('Errore nella verifica del link:', error);
        setIsValid(false);
        setError('Impossibile verificare il link');
        setIsLoading(false);
      }
    };

    checkLink();
  }, [url]);

  return { isValid, isLoading, error };
};


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Key, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PerplexitySearchService } from '@/lib/perplexitySearchService';
import { NewsFetchingService } from '@/lib/newsFetchingService';
import { supabase } from '@/lib/supabaseClient';

// Chiave per localStorage
const PERPLEXITY_API_KEY_STORAGE = 'ethical_tech_digest_perplexity_key';

const PerplexitySettings: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);
  const [isUsingLocalStorage, setIsUsingLocalStorage] = useState<boolean>(false);

  useEffect(() => {
    // Verifica la connessione a Supabase
    const checkSupabaseConnection = async () => {
      try {
        // Try to get Supabase status with a simple call
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Errore di connessione a Supabase:', error);
          setIsSupabaseConnected(false);
          setIsUsingLocalStorage(true);
        } else {
          setIsSupabaseConnected(true);
          
          // Prova a testare la funzione Edge
          try {
            await supabase.functions.invoke('get-perplexity-key');
          } catch (edgeFunctionError) {
            console.error('Errore con la funzione Edge:', edgeFunctionError);
            setIsUsingLocalStorage(true);
          }
        }
      } catch (error) {
        console.error('Errore di connessione a Supabase:', error);
        setIsSupabaseConnected(false);
        setIsUsingLocalStorage(true);
      }
    };
    
    checkSupabaseConnection();
    
    const loadApiKey = async () => {
      try {
        // Prima prova dal localStorage se la modalità localStorage è attiva
        if (isUsingLocalStorage) {
          const localKey = localStorage.getItem(PERPLEXITY_API_KEY_STORAGE);
          if (localKey) {
            setApiKey(localKey);
            return;
          }
        }
        
        // Altrimenti prova da Supabase se connesso
        if (isSupabaseConnected && !isUsingLocalStorage) {
          try {
            const savedKey = await PerplexitySearchService.getApiKey();
            if (savedKey) {
              setApiKey(savedKey);
            }
          } catch (error) {
            console.error('Errore nel caricare l\'API key da Supabase:', error);
            // Se fallisce, passa a localStorage
            setIsUsingLocalStorage(true);
            const localKey = localStorage.getItem(PERPLEXITY_API_KEY_STORAGE);
            if (localKey) setApiKey(localKey);
          }
        }
      } catch (error) {
        console.error('Errore nel caricare l\'API key:', error);
      }
    };
    
    loadApiKey();
  }, [isSupabaseConnected, isUsingLocalStorage]);

  const handleSaveKey = async () => {
    setIsSaving(true);
    
    try {
      if (isUsingLocalStorage) {
        // Salva nel localStorage
        localStorage.setItem(PERPLEXITY_API_KEY_STORAGE, apiKey);
        // Aggiorna anche il servizio
        PerplexitySearchService.setLocalApiKey(apiKey);
        toast.success('API key salvata in localStorage');
      } else {
        // Prova a salvare su Supabase
        try {
          await PerplexitySearchService.setApiKey(apiKey);
          toast.success('API key salvata con successo');
        } catch (error) {
          console.error('Errore nel salvare l\'API key su Supabase:', error);
          // Fallback a localStorage
          setIsUsingLocalStorage(true);
          localStorage.setItem(PERPLEXITY_API_KEY_STORAGE, apiKey);
          PerplexitySearchService.setLocalApiKey(apiKey);
          toast.success('API key salvata in localStorage (modalità fallback)');
        }
      }
    } catch (error) {
      toast.error('Errore nel salvare l\'API key');
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearKey = async () => {
    try {
      if (isUsingLocalStorage) {
        // Rimuovi dal localStorage
        localStorage.removeItem(PERPLEXITY_API_KEY_STORAGE);
        PerplexitySearchService.clearLocalApiKey();
      } else {
        // Prova a rimuovere da Supabase
        try {
          await PerplexitySearchService.clearApiKey();
        } catch (error) {
          console.error('Errore nella rimozione dell\'API key da Supabase:', error);
          // Fallback a localStorage
          setIsUsingLocalStorage(true);
          localStorage.removeItem(PERPLEXITY_API_KEY_STORAGE);
          PerplexitySearchService.clearLocalApiKey();
        }
      }
      
      setApiKey('');
      toast.success('API key rimossa');
    } catch (error) {
      toast.error('Errore nella rimozione dell\'API key');
      console.error('Error clearing API key:', error);
    }
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      toast.error('Inserisci prima una API key');
      return;
    }
    
    setIsTestingConnection(true);
    
    try {
      if (isUsingLocalStorage) {
        // Imposta la chiave direttamente nel servizio
        PerplexitySearchService.setLocalApiKey(apiKey);
      } else {
        // Prova a impostare su Supabase
        try {
          await PerplexitySearchService.setApiKey(apiKey);
        } catch (error) {
          console.error('Errore nell\'impostare l\'API key su Supabase:', error);
          // Fallback a localStorage
          setIsUsingLocalStorage(true);
          PerplexitySearchService.setLocalApiKey(apiKey);
        }
      }
      
      const result = await NewsFetchingService.refreshNews();
      
      if (result.success) {
        toast.success('Connessione a Perplexity API riuscita!');
      } else {
        toast.error(`Test fallito: ${result.message}`);
      }
    } catch (error) {
      toast.error(`Errore di connessione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
      console.error('Connection test error:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key size={18} />
          Configurazione Perplexity API
        </CardTitle>
        <CardDescription>
          Configura la tua chiave API di Perplexity per la ricerca di notizie
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isUsingLocalStorage && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Modalità localStorage attiva: la chiave API verrà salvata localmente anziché su Supabase.
            </AlertDescription>
          </Alert>
        )}
        
        {!isSupabaseConnected && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connessione a Supabase non riuscita. La chiave verrà salvata localmente.
            </AlertDescription>
          </Alert>
        )}
        
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            La chiave API è necessaria per il funzionamento del sistema di ricerca notizie.
            Ottieni la tua chiave su <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="underline">perplexity.ai/settings/api</a>
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              Perplexity API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-between">
        <div>
          <Button variant="outline" onClick={handleClearKey} disabled={!apiKey}>
            Rimuovi chiave
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleTestConnection} 
            disabled={!apiKey || isTestingConnection}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} className={isTestingConnection ? 'animate-spin' : ''} />
            {isTestingConnection ? 'Testing...' : 'Test connessione'}
          </Button>
          <Button 
            onClick={handleSaveKey} 
            disabled={!apiKey || isSaving}
            className="flex items-center gap-1"
          >
            <Save size={16} />
            {isSaving ? 'Salvataggio...' : 'Salva chiave'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PerplexitySettings;

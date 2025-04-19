
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

const PerplexitySettings: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(true);

  useEffect(() => {
    // Verifica la connessione a Supabase
    const checkSupabaseConnection = async () => {
      try {
        // Use the rpc method to check connection instead of querying a table
        const { error } = await supabase.rpc('version');
        setIsSupabaseConnected(!error);
        if (error) {
          console.error('Errore di connessione a Supabase:', error);
          setIsSupabaseConnected(false);
        }
      } catch (error) {
        console.error('Errore di connessione a Supabase:', error);
        setIsSupabaseConnected(false);
      }
    };
    
    checkSupabaseConnection();
    
    const loadApiKey = async () => {
      if (!isSupabaseConnected) return;
      
      try {
        const savedKey = await PerplexitySearchService.getApiKey();
        if (savedKey) {
          setApiKey(savedKey);
        }
      } catch (error) {
        console.error('Errore nel caricare l\'API key:', error);
      }
    };
    
    loadApiKey();
  }, [isSupabaseConnected]);

  const handleSaveKey = async () => {
    if (!isSupabaseConnected) {
      toast.error('Non è possibile salvare la chiave: Supabase non è connesso');
      return;
    }
    
    setIsSaving(true);
    
    try {
      await PerplexitySearchService.setApiKey(apiKey);
      toast.success('API key salvata con successo');
    } catch (error) {
      toast.error('Errore nel salvare l\'API key');
      console.error('Error saving API key:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearKey = async () => {
    if (!isSupabaseConnected) {
      toast.error('Non è possibile rimuovere la chiave: Supabase non è connesso');
      return;
    }
    
    try {
      await PerplexitySearchService.clearApiKey();
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
    
    if (!isSupabaseConnected) {
      toast.error('Non è possibile testare la connessione: Supabase non è connesso');
      return;
    }

    setIsTestingConnection(true);
    
    try {
      await PerplexitySearchService.setApiKey(apiKey);
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
        {!isSupabaseConnected && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connessione a Supabase non riuscita. Verifica che il progetto Supabase sia correttamente configurato.
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
          <Button variant="outline" onClick={handleClearKey} disabled={!apiKey || !isSupabaseConnected}>
            Rimuovi chiave
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleTestConnection} 
            disabled={!apiKey || isTestingConnection || !isSupabaseConnected}
            className="flex items-center gap-1"
          >
            <RefreshCw size={16} className={isTestingConnection ? 'animate-spin' : ''} />
            {isTestingConnection ? 'Testing...' : 'Test connessione'}
          </Button>
          <Button 
            onClick={handleSaveKey} 
            disabled={!apiKey || isSaving || !isSupabaseConnected}
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

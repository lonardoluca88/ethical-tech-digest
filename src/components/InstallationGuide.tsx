
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Code, Copy, FileCode, FileJson, Check } from 'lucide-react';
import { toast } from 'sonner';

const InstallationGuide: React.FC = () => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`Codice ${type} copiato negli appunti`);
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };
  
  const scriptEmbed = `<div id="ethical-tech-digest"></div>
<script src="https://tuodominio.it/widget/ethical-tech-digest.js"></script>`;

  const iframeEmbed = `<iframe 
  src="https://tuodominio.it/widget/" 
  width="100%" 
  height="800" 
  frameborder="0" 
  title="Ethical Tech Digest">
</iframe>`;

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Guida all'Installazione</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Come implementare il widget in Kajabi</h3>
          <p className="text-muted-foreground mb-4">
            Segui questi passi per incorporare il widget Ethical Tech Digest nella tua piattaforma Kajabi.
          </p>
          
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong>Accedi a Kajabi</strong> e vai al pannello di amministrazione.
            </li>
            <li>
              <strong>Scegli la pagina</strong> in cui vuoi inserire il widget.
            </li>
            <li>
              <strong>Aggiungi un blocco HTML personalizzato</strong> alla pagina.
            </li>
            <li>
              <strong>Copia il codice di incorporamento</strong> qui sotto e incollalo nel blocco HTML.
            </li>
            <li>
              <strong>Salva le modifiche</strong> e pubblica la pagina.
            </li>
          </ol>
        </div>
        
        <Tabs defaultValue="script">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="script" className="flex items-center gap-1">
              <Code size={16} />
              Script JS
            </TabsTrigger>
            <TabsTrigger value="iframe" className="flex items-center gap-1">
              <FileCode size={16} />
              iFrame
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="script" className="mt-4">
            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                <code>{scriptEmbed}</code>
              </pre>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2"
                onClick={() => handleCopy(scriptEmbed, 'script')}
              >
                {copied === 'script' ? <Check size={18} /> : <Copy size={18} />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Questo metodo carica il widget come uno script JavaScript ed è la soluzione consigliata.
            </p>
          </TabsContent>
          
          <TabsContent value="iframe" className="mt-4">
            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                <code>{iframeEmbed}</code>
              </pre>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2"
                onClick={() => handleCopy(iframeEmbed, 'iframe')}
              >
                {copied === 'iframe' ? <Check size={18} /> : <Copy size={18} />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              L'iFrame è un'alternativa più semplice, ma potrebbe offrire meno integrazione con la pagina host.
            </p>
          </TabsContent>
        </Tabs>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-1">
            <FileJson size={18} />
            Configurazione del Widget
          </h4>
          <p className="text-sm text-blue-600 mb-3">
            Per personalizzare ulteriormente il widget, puoi aggiungere queste opzioni di configurazione:
          </p>
          <pre className="bg-white p-3 rounded border border-blue-100 text-sm overflow-auto">
            <code>{`<div id="ethical-tech-digest" 
  data-theme="light" 
  data-categories="ai,robotics,biotech">
</div>`}</code>
          </pre>
          <ul className="text-sm text-blue-600 mt-3 space-y-1">
            <li><code>data-theme</code>: "light" o "dark" per adattarsi al tema del tuo sito</li>
            <li><code>data-categories</code>: limita le categorie mostrate inizialmente</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Caricamento tramite FTP</h3>
          <p className="text-muted-foreground mb-3">
            Se preferisci ospitare il widget su un tuo sottodominio, ecco come fare:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-sm">
            <li>Scarica tutti i file generati dal widget</li>
            <li>Crea un sottodominio (es. <code>widget.tuodominio.it</code>) dal tuo pannello hosting</li>
            <li>Utilizza FileZilla per connetterti al tuo server FTP</li>
            <li>Carica tutti i file nella directory del sottodominio</li>
            <li>Aggiorna gli URL nei codici di incorporamento con il tuo sottodominio</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};

export default InstallationGuide;

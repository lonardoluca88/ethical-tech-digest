
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Code, Copy, FileCode, FileJson, Check, AlertTriangle } from 'lucide-react';
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
  
  // Aggiornato per utilizzare correttamente il metodo iframe che funziona
  const scriptEmbed = `<div id="ethical-tech-digest" data-theme="light" data-categories="ai,robotics,biotech"></div>
<script src="https://leonardo2030.entourage-di-kryon.it/lovablenews/widget/ethical-tech-digest.js"></script>`;

  const iframeEmbed = `<iframe 
  src="https://leonardo2030.entourage-di-kryon.it/lovablenews/?theme=light&categories=ai,robotics,biotech" 
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
        
        <Tabs defaultValue="iframe">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="script" className="flex items-center gap-1">
              <Code size={16} />
              Script JS
            </TabsTrigger>
            <TabsTrigger value="iframe" className="flex items-center gap-1">
              <FileCode size={16} />
              iFrame (consigliato)
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
            <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-md mt-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <p className="text-sm text-amber-800">
                Il metodo script potrebbe non funzionare in tutti gli ambienti. In caso di problemi, usa il metodo iFrame.
              </p>
            </div>
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
            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md mt-2">
              <Check size={16} className="text-green-600" />
              <p className="text-sm text-green-800">
                Metodo consigliato: l'iFrame è più affidabile e funziona in tutti gli ambienti.
              </p>
            </div>
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
            <code>{`<!-- Per il metodo script -->
<div id="ethical-tech-digest" 
  data-theme="light" 
  data-categories="ai,robotics,biotech">
</div>

<!-- Per il metodo iFrame -->
<iframe src="https://leonardo2030.entourage-di-kryon.it/lovablenews/?theme=light&categories=ai,robotics,biotech" ...`}</code>
          </pre>
          <ul className="text-sm text-blue-600 mt-3 space-y-1">
            <li><code>theme</code>: "light" o "dark" per adattarsi al tema del tuo sito</li>
            <li><code>categories</code>: limita le categorie mostrate inizialmente</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Risoluzione problemi comuni</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
              <p className="text-sm">
                <strong>Widget non visibile:</strong> Se il widget non appare, prova ad utilizzare il metodo iFrame che è più affidabile.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
              <p className="text-sm">
                <strong>CSS in conflitto:</strong> Se il layout appare distorto, potrebbe esserci un conflitto CSS con il tuo sito. L'iFrame isola questi problemi.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
              <p className="text-sm">
                <strong>Altezza non corretta:</strong> Se l'altezza dell'iFrame non è sufficiente, aumentala modificando il valore <code>height="800"</code>.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default InstallationGuide;


import React, { useState, useEffect } from 'react';
import { AppSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface StylesCustomizerProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const StylesCustomizer: React.FC<StylesCustomizerProps> = ({ 
  settings, 
  onUpdate 
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [previewStyle, setPreviewStyle] = useState({
    backgroundColor: settings.backgroundColor,
    color: settings.textColor,
    borderColor: settings.accentColor,
  });
  
  useEffect(() => {
    setPreviewStyle({
      backgroundColor: localSettings.backgroundColor,
      color: localSettings.textColor,
      borderColor: localSettings.accentColor,
    });
  }, [localSettings]);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings({ ...localSettings, [name]: value });
  };
  
  const handleSave = () => {
    onUpdate(localSettings);
    toast.success('Stile aggiornato con successo');
  };
  
  const handleReset = () => {
    setLocalSettings(settings);
    toast.info('Modifiche annullate');
  };
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Personalizza Stile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Colore di Sfondo</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                name="backgroundColor"
                type="text"
                value={localSettings.backgroundColor}
                onChange={handleColorChange}
                placeholder="#ffffff"
              />
              <Input
                type="color"
                value={localSettings.backgroundColor}
                onChange={(e) => setLocalSettings({ 
                  ...localSettings, 
                  backgroundColor: e.target.value 
                })}
                className="w-12 p-1 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="textColor">Colore del Testo</Label>
            <div className="flex gap-2">
              <Input
                id="textColor"
                name="textColor"
                type="text"
                value={localSettings.textColor}
                onChange={handleColorChange}
                placeholder="#000000"
              />
              <Input
                type="color"
                value={localSettings.textColor}
                onChange={(e) => setLocalSettings({ 
                  ...localSettings, 
                  textColor: e.target.value 
                })}
                className="w-12 p-1 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accentColor">Colore Accent</Label>
            <div className="flex gap-2">
              <Input
                id="accentColor"
                name="accentColor"
                type="text"
                value={localSettings.accentColor}
                onChange={handleColorChange}
                placeholder="#3B82F6"
              />
              <Input
                type="color"
                value={localSettings.accentColor}
                onChange={(e) => setLocalSettings({ 
                  ...localSettings, 
                  accentColor: e.target.value 
                })}
                className="w-12 p-1 cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} className="flex-1">
              Salva Modifiche
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset} 
              className="flex-1"
            >
              Reimposta
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Anteprima</h3>
          <div 
            className="border-2 rounded-lg p-4 h-[200px] flex flex-col items-center justify-center"
            style={previewStyle}
          >
            <h4 className="text-xl font-bold" style={{ color: localSettings.textColor }}>
              Ethical Tech Digest
            </h4>
            <p className="mt-2 text-center" style={{ color: localSettings.textColor }}>
              Questa è un'anteprima del widget con i colori selezionati.
            </p>
            <Button 
              className="mt-4"
              style={{ 
                backgroundColor: localSettings.accentColor,
                color: '#ffffff'
              }}
            >
              Pulsante di esempio
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Questa è solo un'anteprima dello stile. I cambiamenti saranno visibili nel widget dopo il salvataggio.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default StylesCustomizer;

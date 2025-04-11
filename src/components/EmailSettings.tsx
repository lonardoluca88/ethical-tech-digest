
import React, { useState } from 'react';
import { AppSettings, EmailSettings as EmailSettingsType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Send, LockKeyhole, Loader2 } from 'lucide-react';
import { sendTestEmail } from '@/lib/emailService';

interface EmailSettingsProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [isSending, setIsSending] = useState(false);
  
  const weekdays = [
    { value: '0', label: 'Domenica' },
    { value: '1', label: 'Lunedì' },
    { value: '2', label: 'Martedì' },
    { value: '3', label: 'Mercoledì' },
    { value: '4', label: 'Giovedì' },
    { value: '5', label: 'Venerdì' },
    { value: '6', label: 'Sabato' }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Handle nested SMTP settings
    if (name.startsWith('smtp.')) {
      const smtpField = name.split('.')[1];
      setLocalSettings({
        ...localSettings,
        emailSettings: {
          ...localSettings.emailSettings,
          smtp: {
            ...localSettings.emailSettings.smtp,
            [smtpField]: smtpField === 'port' ? Number(value) : value
          }
        }
      });
    } else {
      // Handle top-level email settings
      setLocalSettings({
        ...localSettings,
        emailSettings: {
          ...localSettings.emailSettings,
          [name]: value
        }
      });
    }
  };
  
  const handleDigestDayChange = (value: string) => {
    setLocalSettings({
      ...localSettings,
      emailSettings: {
        ...localSettings.emailSettings,
        weeklyDigestDay: Number(value)
      }
    });
  };
  
  const handleToggleEmailNotifications = (enabled: boolean) => {
    setLocalSettings({
      ...localSettings,
      emailNotificationsEnabled: enabled
    });
  };
  
  const handleSave = () => {
    onUpdate(localSettings);
    toast.success('Impostazioni email aggiornate con successo');
  };
  
  const handleTestEmail = async () => {
    setIsSending(true);
    
    try {
      // Invia email di test utilizzando il servizio
      const result = await sendTestEmail(localSettings.emailSettings);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Errore durante l\'invio dell\'email di test:', error);
      toast.error('Si è verificato un errore durante l\'invio dell\'email di test. Controlla la console per maggiori dettagli.');
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Impostazioni Email</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Notifiche Email Settimanali</h3>
            <p className="text-sm text-muted-foreground">
              Invia automaticamente un riepilogo settimanale via email
            </p>
          </div>
          <Switch 
            checked={localSettings.emailNotificationsEnabled}
            onCheckedChange={handleToggleEmailNotifications}
          />
        </div>
        
        {localSettings.emailNotificationsEnabled && (
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Email Destinatario</Label>
                <Input
                  id="recipientEmail"
                  name="recipientEmail"
                  type="email"
                  value={localSettings.emailSettings.recipientEmail}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senderEmail">Email Mittente</Label>
                <Input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  value={localSettings.emailSettings.senderEmail}
                  onChange={handleChange}
                  placeholder="noreply@yoursite.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weeklyDigestDay">Giorno di invio</Label>
              <Select 
                value={localSettings.emailSettings.weeklyDigestDay.toString()}
                onValueChange={handleDigestDayChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un giorno" />
                </SelectTrigger>
                <SelectContent>
                  {weekdays.map(day => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Il riepilogo verrà inviato ogni {weekdays.find(d => d.value === localSettings.emailSettings.weeklyDigestDay.toString())?.label.toLowerCase()}
              </p>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="font-medium flex items-center gap-1 mb-2">
                <LockKeyhole size={16} />
                Configurazione SMTP
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp.host">Server SMTP</Label>
                  <Input
                    id="smtp.host"
                    name="smtp.host"
                    value={localSettings.emailSettings.smtp.host}
                    onChange={handleChange}
                    placeholder="smtp.example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp.port">Porta</Label>
                  <Input
                    id="smtp.port"
                    name="smtp.port"
                    type="number"
                    value={localSettings.emailSettings.smtp.port}
                    onChange={handleChange}
                    placeholder="587"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp.user">Nome utente</Label>
                  <Input
                    id="smtp.user"
                    name="smtp.user"
                    value={localSettings.emailSettings.smtp.user}
                    onChange={handleChange}
                    placeholder="username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smtp.password">Password</Label>
                  <Input
                    id="smtp.password"
                    name="smtp.password"
                    type="password"
                    value={localSettings.emailSettings.smtp.password}
                    onChange={handleChange}
                    placeholder="Password SMTP"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button 
                onClick={handleTestEmail} 
                variant="outline" 
                className="flex items-center gap-1"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Invia email di prova
                  </>
                )}
              </Button>
              <Button onClick={handleSave}>Salva impostazioni</Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmailSettings;

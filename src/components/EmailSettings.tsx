
import React, { useState } from 'react';
import { AppSettings, EmailSettings as EmailSettingsType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Send, LockKeyhole, Loader2, Info, CheckCircle } from 'lucide-react';
import { sendTestEmail, testSmtpConnection } from '@/lib/emailService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface EmailSettingsProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

// Schema di validazione per le impostazioni email
const emailSettingsSchema = z.object({
  recipientEmail: z.string().email("Inserisci un indirizzo email valido"),
  senderEmail: z.string().email("Inserisci un indirizzo email valido"),
  smtp: z.object({
    host: z.string().min(1, "Il server SMTP è obbligatorio"),
    port: z.number().int().positive("La porta deve essere un numero positivo"),
    secure: z.boolean(),
    user: z.string().min(1, "L'utente SMTP è obbligatorio"),
    password: z.string().min(1, "La password SMTP è obbligatoria"),
  }),
  weeklyDigestDay: z.number().min(0).max(6),
});

const EmailSettings: React.FC<EmailSettingsProps> = ({ settings, onUpdate }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>({...settings});
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);
  
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
  
  const handleToggleSecure = (checked: boolean) => {
    setLocalSettings({
      ...localSettings,
      emailSettings: {
        ...localSettings.emailSettings,
        smtp: {
          ...localSettings.emailSettings.smtp,
          secure: checked
        }
      }
    });
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
    setIsSendingTest(true);
    
    try {
      console.log("Iniziando test di invio email...");
      console.log("Impostazioni SMTP:", localSettings.emailSettings.smtp);
      console.log("Email mittente:", localSettings.emailSettings.senderEmail);
      console.log("Email destinatario:", localSettings.emailSettings.recipientEmail);
      
      // Invia email di test utilizzando il servizio
      const result = await sendTestEmail(localSettings.emailSettings);
      
      if (result.success) {
        setLastSentTime(new Date());
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Errore durante l\'invio dell\'email di test:', error);
      toast.error('Si è verificato un errore durante l\'invio dell\'email di test. Controlla la console per maggiori dettagli.');
    } finally {
      setIsSendingTest(false);
    }
  };
  
  const handleTestSmtpConnection = async () => {
    setIsTestingSmtp(true);
    
    try {
      // Verifica connessione SMTP
      const result = await testSmtpConnection(localSettings.emailSettings);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Errore durante il test della connessione SMTP:', error);
      toast.error('Si è verificato un errore durante il test della connessione SMTP.');
    } finally {
      setIsTestingSmtp(false);
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
            <Alert className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-700">Nota sull'invio email</AlertTitle>
              <AlertDescription className="text-amber-600">
                Questa è una versione demo che simula l'invio di email. In un'applicazione reale, 
                l'invio di email richiederebbe un server backend per la gestione sicura delle credenziali SMTP.
              </AlertDescription>
            </Alert>
            
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
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smtp.secure"
                    checked={localSettings.emailSettings.smtp.secure}
                    onCheckedChange={handleToggleSecure}
                  />
                  <Label htmlFor="smtp.secure">Connessione sicura (SSL/TLS)</Label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button 
                onClick={handleTestSmtpConnection} 
                variant="outline" 
                className="flex items-center gap-1"
                disabled={isTestingSmtp || !localSettings.emailSettings.smtp.host}
              >
                {isTestingSmtp ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Verifica connessione...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Verifica connessione SMTP
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleTestEmail} 
                variant="outline" 
                className="flex items-center gap-1"
                disabled={isSendingTest}
              >
                {isSendingTest ? (
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
            
            {lastSentTime && (
              <div className="text-sm text-green-600 flex items-center mt-2">
                <CheckCircle size={16} className="mr-1" />
                Ultimo test inviato: {lastSentTime.toLocaleTimeString()}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmailSettings;

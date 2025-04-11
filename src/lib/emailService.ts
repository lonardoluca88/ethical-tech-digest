
import { EmailSettings, EmailTestResult } from './types';

// Funzione simulata per l'invio di email di test
export const sendTestEmail = async (settings: EmailSettings): Promise<EmailTestResult> => {
  return new Promise((resolve) => {
    console.log('Tentativo di invio email di test con le impostazioni:', settings);
    
    setTimeout(() => {
      // Verifichiamo che tutti i campi necessari siano compilati
      if (!settings.smtp.host || !settings.smtp.user || !settings.smtp.password || 
          !settings.recipientEmail || !settings.senderEmail) {
        resolve({
          success: false,
          message: 'Errore: Compila tutti i campi necessari per inviare un\'email di test.'
        });
        return;
      }
      
      // In un'applicazione reale qui chiameremmo un endpoint API per inviare l'email
      // Simuliamo un successo dopo le verifiche
      resolve({
        success: true,
        message: `Email di test inviata con successo da ${settings.senderEmail} a ${settings.recipientEmail} utilizzando il server ${settings.smtp.host}`
      });
    }, 1500);
  });
};

// Funzione per inviare il riepilogo settimanale
export const sendWeeklyDigest = async (settings: EmailSettings): Promise<EmailTestResult> => {
  // Implementazione simile alla precedente, ma per inviare il riepilogo settimanale
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Riepilogo settimanale inviato con successo'
      });
    }, 1500);
  });
};


import { EmailSettings, EmailTestResult } from './types';

// Funzione per inviare email di test
export const sendTestEmail = async (settings: EmailSettings): Promise<EmailTestResult> => {
  return new Promise((resolve) => {
    console.log('Tentativo di invio email di test con le impostazioni:', settings);
    
    // Verifichiamo che tutti i campi necessari siano compilati
    if (!settings.smtp.host || !settings.smtp.user || !settings.smtp.password || 
        !settings.recipientEmail || !settings.senderEmail) {
      console.log('Errore: campi mancanti nelle impostazioni SMTP');
      resolve({
        success: false,
        message: 'Errore: Compila tutti i campi necessari per inviare un\'email di test.'
      });
      return;
    }

    // In un'applicazione front-end, non possiamo usare direttamente nodemailer
    // Pertanto simuliamo una richiesta a un servizio esterno usando setTimeout
    setTimeout(() => {
      try {
        // Logghiamo per debugging
        console.log(`Simulazione invio email: da ${settings.senderEmail} a ${settings.recipientEmail} via ${settings.smtp.host}:${settings.smtp.port}`);
        console.log('Corpo email di test:', `
          Oggetto: Test email da Ethical Tech Digest
          ---------------------------------------
          Questo è un messaggio di prova inviato dal widget Ethical Tech Digest.
          
          Configurazione SMTP:
          Server: ${settings.smtp.host}
          Porta: ${settings.smtp.port}
          Utente: ${settings.smtp.user}
          
          Se stai ricevendo questa email, significa che la configurazione è corretta!
          
          ---------------------------------------
        `);
        
        // In ambiente di produzione, questa chiamata dovrebbe essere inviata a un servizio backend
        // che gestisce l'invio effettivo dell'email tramite un server SMTP
        // fetch('https://api.tuodominio.it/send-email', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ settings, type: 'test' })
        // });
        
        resolve({
          success: true,
          message: `Email di test inviata con successo da ${settings.senderEmail} a ${settings.recipientEmail}\n\nNota: In questa versione di demo, l'invio è simulato. Per l'invio reale, configura un servizio backend sul tuo dominio.`
        });
      } catch (error) {
        console.error('Errore durante la simulazione dell\'invio dell\'email:', error);
        resolve({
          success: false,
          message: `Errore durante l'invio dell'email: ${error instanceof Error ? error.message : String(error)}`
        });
      }
    }, 1500);
  });
};

// Funzione per inviare il riepilogo settimanale
export const sendWeeklyDigest = async (settings: EmailSettings): Promise<EmailTestResult> => {
  // Implementazione simile alla precedente, ma per inviare il riepilogo settimanale
  return new Promise((resolve) => {
    console.log('Invio riepilogo settimanale con le impostazioni:', settings);

    // Verifichiamo che tutti i campi necessari siano compilati
    if (!settings.smtp.host || !settings.smtp.user || !settings.smtp.password || 
        !settings.recipientEmail || !settings.senderEmail) {
      resolve({
        success: false,
        message: 'Errore: Compila tutti i campi necessari per inviare il riepilogo settimanale.'
      });
      return;
    }

    setTimeout(() => {
      try {
        // Logghiamo per debugging
        console.log(`Simulazione invio riepilogo settimanale: da ${settings.senderEmail} a ${settings.recipientEmail}`);
        
        // In ambiente di produzione, questa chiamata dovrebbe essere inviata a un servizio backend
        // fetch('https://api.tuodominio.it/send-email', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ settings, type: 'weekly-digest' })
        // });
        
        resolve({
          success: true,
          message: `Riepilogo settimanale inviato con successo a ${settings.recipientEmail}`
        });
      } catch (error) {
        console.error('Errore durante l\'invio del riepilogo settimanale:', error);
        resolve({
          success: false,
          message: `Errore durante l'invio del riepilogo: ${error instanceof Error ? error.message : String(error)}`
        });
      }
    }, 1500);
  });
};

// Funzione di utilità per verificare la connessione SMTP
export const testSmtpConnection = async (settings: EmailSettings): Promise<EmailTestResult> => {
  return new Promise((resolve) => {
    console.log('Test di connessione SMTP con le impostazioni:', settings);
    
    // Verifichiamo i campi di base
    if (!settings.smtp.host || !settings.smtp.port) {
      resolve({
        success: false,
        message: 'Errore: Specifica almeno host e porta SMTP per testare la connessione.'
      });
      return;
    }

    setTimeout(() => {
      // Questo è un test simulato - in un'applicazione reale si testerebbe l'effettiva connessione
      console.log(`Test connessione SMTP a ${settings.smtp.host}:${settings.smtp.port}`);
      
      // In ambiente di produzione, questa chiamata dovrebbe verificare la connessione tramite un servizio backend
      // fetch('https://api.tuodominio.it/test-smtp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ settings })
      // });
      
      resolve({
        success: true,
        message: `Connessione SMTP a ${settings.smtp.host}:${settings.smtp.port} verificata con successo.\n\nNota: In questa versione di demo, il test è simulato. Per un test reale, configura un servizio backend.`
      });
    }, 1000);
  });
};

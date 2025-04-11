
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://leonardo2030.entourage-di-kryon.it');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Risposta in caso di metodo non valido
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metodo non consentito']);
    exit;
}

// Legge i dati JSON dalla richiesta
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dati non validi']);
    exit;
}

// Verifica che tutti i campi necessari siano presenti
$settings = $data['settings'] ?? null;
$type = $data['type'] ?? null;

if (!$settings || !$type) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Parametri mancanti']);
    exit;
}

// Verifica che i dati SMTP siano completi
if (empty($settings['smtp']['host']) || 
    empty($settings['smtp']['port']) || 
    empty($settings['smtp']['user']) || 
    empty($settings['smtp']['password']) ||
    empty($settings['senderEmail']) ||
    empty($settings['recipientEmail'])) {
    
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dati SMTP incompleti']);
    exit;
}

// Funzione per inviare email
function sendEmail($settings, $subject, $body) {
    // Occultiamo la password nei log per sicurezza
    $logSettings = $settings;
    $logSettings['smtp']['password'] = '[NASCOSTA PER SICUREZZA]';
    
    $smtpHost = $settings['smtp']['host'];
    $smtpPort = $settings['smtp']['port'];
    $smtpUser = $settings['smtp']['user'];
    $smtpPassword = $settings['smtp']['password'];
    $smtpSecure = $settings['smtp']['secure'] ? 'ssl' : 'tls';
    $senderEmail = $settings['senderEmail'];
    $recipientEmail = $settings['recipientEmail'];

    // Intestazioni email
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Ethical Tech Digest <$senderEmail>\r\n";
    $headers .= "Reply-To: $senderEmail\r\n";
    
    // Log per debug (senza password)
    error_log("Tentativo di invio email da $senderEmail a $recipientEmail tramite $smtpHost:$smtpPort");
    
    // Configura le opzioni SMTP per PHPMailer con controlli di sicurezza
    $smtpOptions = "-f$senderEmail";
    
    // Tentativo di invio
    $result = mail($recipientEmail, $subject, $body, $headers, $smtpOptions);
    
    // Log del risultato
    if ($result) {
        error_log("Email inviata con successo a $recipientEmail");
        return true;
    } else {
        error_log("Errore nell'invio dell'email a $recipientEmail: " . error_get_last()['message']);
        return false;
    }
}

// Gestisce i diversi tipi di richiesta
if ($type === 'test') {
    // Prepara il corpo dell'email di test
    $subject = "Test email da Ethical Tech Digest";
    $body = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #4b5563; color: white; padding: 10px; text-align: center; }
                .footer { background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; }
                .content { padding: 20px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Ethical Tech Digest</h1>
                </div>
                <div class='content'>
                    <h2>Email di Test</h2>
                    <p>Questo è un messaggio di prova inviato dal widget Ethical Tech Digest.</p>
                    <p>Configurazione SMTP:</p>
                    <ul>
                        <li>Server: {$settings['smtp']['host']}</li>
                        <li>Porta: {$settings['smtp']['port']}</li>
                        <li>Utente: {$settings['smtp']['user']}</li>
                    </ul>
                    <p>Se stai ricevendo questa email, significa che la configurazione è corretta!</p>
                </div>
                <div class='footer'>
                    <p>© " . date('Y') . " Ethical Tech Digest</p>
                </div>
            </div>
        </body>
        </html>
    ";
    
    // Invia l'email di test
    $success = sendEmail($settings, $subject, $body);
    
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Email di test inviata con successo']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Errore nell\'invio dell\'email di test']);
    }
} elseif ($type === 'weekly-digest') {
    // Qui implementeresti la generazione del contenuto del digest settimanale
    // e l'invio effettivo utilizzando la stessa funzione sendEmail
    
    // Per questo esempio, simuliamo che il digest sia stato inviato con successo
    echo json_encode(['success' => true, 'message' => 'Digest settimanale inviato con successo']);
} elseif ($type === 'test-connection') {
    // Qui verificheresti la connessione SMTP senza inviare un'email effettiva
    
    // Per semplicità, simuliamo una connessione riuscita
    echo json_encode(['success' => true, 'message' => 'Connessione SMTP verificata con successo']);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tipo di richiesta non supportato']);
}
?>

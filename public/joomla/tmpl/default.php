
<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_ethical_tech_digest
 *
 * @copyright   Copyright (C) 2025 All rights reserved.
 * @license     GNU General Public License version 2 or later;
 */

// No direct access
defined('_JEXEC') or die;

// Accesso ai parametri processati dal file mod_ethical_tech_digest.php
?>

<div class="ethical-tech-digest-container<?php echo $moduleclass_sfx; ?>">
    <?php if ($method === 'iframe') : ?>
        <!-- Metodo iframe (consigliato) -->
        <iframe 
            src="<?php echo $baseUrl; ?>?theme=<?php echo $theme; ?>&categories=<?php echo $categories; ?>&t=<?php echo time(); ?>" 
            width="100%" 
            height="<?php echo $height; ?>" 
            frameborder="0" 
            title="Ethical Tech Digest">
        </iframe>
    <?php else : ?>
        <!-- Metodo script -->
        <div id="<?php echo $widgetId; ?>" data-theme="<?php echo $theme; ?>" data-categories="<?php echo $categories; ?>"></div>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Funzione per caricare il widget
                function loadEthicalTechDigest() {
                    const container = document.getElementById('<?php echo $widgetId; ?>');
                    if (!container) return;
                    
                    // Crea direttamente l'iframe (il metodo più affidabile)
                    const iframe = document.createElement('iframe');
                    iframe.style.width = '100%';
                    iframe.style.height = '<?php echo $height; ?>px';
                    iframe.style.border = 'none';
                    iframe.style.overflow = 'hidden';
                    iframe.setAttribute('title', 'Ethical Tech Digest');
                    iframe.setAttribute('loading', 'lazy');
                    
                    // Costruisci l'URL con i parametri
                    const url = '<?php echo $baseUrl; ?>?theme=' + 
                                container.getAttribute('data-theme') + 
                                '&categories=' + 
                                container.getAttribute('data-categories') + 
                                '&t=' + new Date().getTime();
                    
                    iframe.setAttribute('src', url);
                    
                    // Pulisci container e aggiungi l'iframe
                    container.innerHTML = '';
                    container.appendChild(iframe);
                }
                
                // Esegui caricamento
                loadEthicalTechDigest();
            });
        </script>
    <?php endif; ?>
</div>

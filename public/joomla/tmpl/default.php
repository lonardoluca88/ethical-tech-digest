
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

// Access to processed parameters
?>

<div class="ethical-tech-digest-container<?php echo $moduleclass_sfx; ?>">
    <?php if ($method === 'iframe') : ?>
        <!-- iframe method (recommended) -->
        <iframe 
            src="<?php echo $baseUrl; ?>?theme=<?php echo $theme; ?>&categories=<?php echo $categories; ?>&t=<?php echo time(); ?>" 
            width="100%" 
            height="<?php echo $height; ?>" 
            frameborder="0" 
            loading="lazy"
            title="Ethical Tech Digest">
        </iframe>
    <?php else : ?>
        <!-- script method -->
        <div id="<?php echo $widgetId; ?>" data-theme="<?php echo $theme; ?>" data-categories="<?php echo $categories; ?>" class="ethical-tech-loading">Loading widget...</div>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Function to load the widget
                function loadEthicalTechDigest() {
                    const container = document.getElementById('<?php echo $widgetId; ?>');
                    if (!container) return;
                    
                    // Create the iframe directly
                    const iframe = document.createElement('iframe');
                    iframe.style.width = '100%';
                    iframe.style.height = '<?php echo $height; ?>px';
                    iframe.style.border = 'none';
                    iframe.style.overflow = 'hidden';
                    iframe.setAttribute('title', 'Ethical Tech Digest');
                    iframe.setAttribute('loading', 'lazy');
                    
                    // Build the URL with parameters
                    const url = '<?php echo $baseUrl; ?>?theme=' + 
                                container.getAttribute('data-theme') + 
                                '&categories=' + 
                                container.getAttribute('data-categories') + 
                                '&t=' + new Date().getTime();
                    
                    iframe.setAttribute('src', url);
                    
                    // Clear container and add the iframe
                    container.innerHTML = '';
                    container.appendChild(iframe);
                    container.className = 'ethical-tech-digest-loaded';
                }
                
                // Execute loading
                loadEthicalTechDigest();
            });
        </script>
    <?php endif; ?>
</div>

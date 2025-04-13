
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

use Joomla\CMS\Installer\InstallerScript;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Log\Log;

/**
 * Script file for the Ethical Tech Digest module
 */
class mod_ethical_tech_digestInstallerScript extends InstallerScript
{
    /**
     * Minimum PHP version required
     *
     * @var    string
     */
    protected $minimumPhp = '7.4.0';

    /**
     * Minimum Joomla version required
     *
     * @var    string
     */
    protected $minimumJoomla = '5.0.0';

    /**
     * Function called before extension installation/update/removal process starts
     *
     * @param   string     $type    The type of change (install, update or discover_install)
     * @param   Installer  $parent  The class calling this method
     *
     * @return  boolean  True on success
     */
    public function preflight($type, $parent)
    {
        if ($type == 'update') {
            // Controlli aggiuntivi per gli aggiornamenti
            // ...
        }

        return parent::preflight($type, $parent);
    }

    /**
     * Function called after extension installation/update/removal process finishes
     *
     * @param   string     $type    The type of change (install, update or discover_install)
     * @param   Installer  $parent  The class calling this method
     *
     * @return  boolean  True on success
     */
    public function postflight($type, $parent)
    {
        if ($type == 'install') {
            // Log dell'installazione
            Log::add('Modulo Ethical Tech Digest installato con successo', Log::INFO, 'mod_ethical_tech_digest');
            
            // Messaggio di successo
            echo '<div class="alert alert-success">';
            echo '<h3>Ethical Tech Digest installato con successo!</h3>';
            echo '<p>Per configurare il modulo, vai a <strong>Contenuto &gt; Gestione moduli</strong> e cerca "Ethical Tech Digest".</p>';
            echo '<p>Ricordati di pubblicare il modulo in una posizione del template.</p>';
            echo '</div>';
        }

        return true;
    }
}

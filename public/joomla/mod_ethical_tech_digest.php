
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

use Joomla\CMS\Helper\ModuleHelper;

// Prepariamo i parametri
$theme = $params->get('theme', 'light');
$categoriesArray = $params->get('categories', ['ai', 'robotics', 'biotech']);

// Convertiamo l'array di categorie in una stringa separata da virgole
if (is_array($categoriesArray)) {
    $categories = implode(',', $categoriesArray);
} else {
    $categories = 'ai,robotics,biotech';
}

$height = $params->get('height', '800');
$method = $params->get('method', 'iframe');

// Base URL del widget
$baseUrl = 'https://leonardo2030.entourage-di-kryon.it/lovablenews/';

// Generiamo un ID univoco per il container (utile se ci sono più istanze del modulo nella stessa pagina)
$widgetId = 'ethical-tech-digest-' . $module->id;

// Passiamo variabili al template
$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx', ''));

require ModuleHelper::getLayoutPath('mod_ethical_tech_digest', 'default');

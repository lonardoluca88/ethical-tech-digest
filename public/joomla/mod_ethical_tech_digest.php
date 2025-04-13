
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
use Joomla\CMS\HTML\HTMLHelper;

// Add module styles
HTMLHelper::_('stylesheet', 'mod_ethical_tech_digest/styles.css', ['relative' => true]);

// Get parameters
$theme = $params->get('theme', 'light');

// Handle categories - they could be an array (from checkboxes) or a pre-formatted string
$categoriesParam = $params->get('categories', ['ai', 'robotics', 'biotech']);
if (is_array($categoriesParam)) {
    // Check if we have any selected categories at all
    $selectedCategories = [];
    foreach ($categoriesParam as $category => $isSelected) {
        if ($isSelected) {
            $selectedCategories[] = $category;
        }
    }
    
    $categories = !empty($selectedCategories) ? implode(',', $selectedCategories) : 'ai,robotics,biotech';
} else {
    $categories = $categoriesParam ?: 'ai,robotics,biotech';
}

$height = $params->get('height', '800');
$method = $params->get('method', 'iframe');

// Base URL of the widget
$baseUrl = 'https://leonardo2030.entourage-di-kryon.it/lovablenews/';

// Generate a unique widget ID for this module instance
$widgetId = 'ethical-tech-digest-' . $module->id;

// Get module class suffix
$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx', ''));

// Load the template
require ModuleHelper::getLayoutPath('mod_ethical_tech_digest', 'default');

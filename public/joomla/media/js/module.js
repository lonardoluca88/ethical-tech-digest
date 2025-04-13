
/**
 * Ethical Tech Digest Module JavaScript
 * 
 * @package     mod_ethical_tech_digest
 * @copyright   Copyright (C) 2025 All rights reserved.
 */

(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    // This file can be used for advanced JavaScript functionality if needed
    console.log('Ethical Tech Digest module initialized');
    
    // Listen for iframe resize messages if implemented in the future
    window.addEventListener('message', function(event) {
      // Verify the origin of the message for security
      if (event.origin !== 'https://leonardo2030.entourage-di-kryon.it') {
        return;
      }
      
      // Handle potential resize messages
      if (event.data && event.data.type === 'resize' && event.data.height) {
        const iframes = document.querySelectorAll('.ethical-tech-digest-container iframe');
        iframes.forEach(function(iframe) {
          iframe.style.height = event.data.height + 'px';
        });
      }
    });
  });
})();

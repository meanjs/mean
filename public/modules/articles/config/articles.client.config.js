'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Articles', 'articles');
        Menus.addMenuItem('topbar', 'New Article', 'articles/create');
    }
]);

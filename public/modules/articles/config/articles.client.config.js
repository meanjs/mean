'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
<<<<<<< HEAD
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown');
		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
	}
=======
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Articles', 'articles');
        Menus.addMenuItem('topbar', 'New Article', 'articles/create');
    }
>>>>>>> pr/63
]);

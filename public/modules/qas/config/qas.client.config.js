'use strict';

// Configuring the Articles module.
angular.module('qas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Qas', 'qas', 'dropdown', '/qas(/create)?');
		Menus.addSubMenuItem('topbar', 'qas', 'List Qas', 'qas');
		Menus.addSubMenuItem('topbar', 'qas', 'New Qa', 'qas/create');
        Menus.addSubMenuItem('topbar', 'qas', 'List Quizzes', 'listquizzes');
	}
]);
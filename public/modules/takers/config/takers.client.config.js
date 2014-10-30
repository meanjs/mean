'use strict';

// Configuring the Takers module
angular.module('takers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Takers', 'takers', 'dropdown', '/takers(/create)?');
		Menus.addSubMenuItem('topbar', 'takers', 'List Takers', 'takers');
        Menus.addSubMenuItem('topbar', 'takers', 'New Taker', 'takers/create');
        Menus.addSubMenuItem('topbar', 'takers', 'Take', 'takers/');
		Menus.addSubMenuItem('topbar', 'takers', 'List Quizzes', 'listTakersQuizzes');
	}
]);

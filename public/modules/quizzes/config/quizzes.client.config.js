'use strict';

// Configuring the Articles module
angular.module('quizzes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Quizzes', 'quizzes', 'dropdown', '/quizzes(/create)?');
		Menus.addSubMenuItem('topbar', 'quizzes', 'List Quizzes', 'quizzes');
		Menus.addSubMenuItem('topbar', 'quizzes', 'New Quiz', 'quizzes/create');
	}
]);
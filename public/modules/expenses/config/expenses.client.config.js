'use strict';

// Configuring the Articles module
angular.module('expenses').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Expenses', 'expenses', 'dropdown', '/expenses(/create)?');
		Menus.addSubMenuItem('topbar', 'expenses', 'List Expenses', 'expenses');
		Menus.addSubMenuItem('topbar', 'expenses', 'New Expense', 'expenses/create');
	}
]);
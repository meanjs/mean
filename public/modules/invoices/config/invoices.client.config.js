'use strict';

// Configuring the Articles module
angular.module('invoices').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Invoices', 'invoices', 'dropdown', '/invoices(/create)?');
		Menus.addSubMenuItem('topbar', 'invoices', 'List Invoices', 'invoices');
		Menus.addSubMenuItem('topbar', 'invoices', 'New Invoice', 'invoices/create');
	}
]);
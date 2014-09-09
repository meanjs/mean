'use strict';

// Configuring the Articles module
angular.module('vendors').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Vendors', 'vendors', 'dropdown', '/vendors(/create)?');
		Menus.addSubMenuItem('topbar', 'vendors', 'List Vendors', 'vendors');
		Menus.addSubMenuItem('topbar', 'vendors', 'New Vendor', 'vendors/create');
	}
]);
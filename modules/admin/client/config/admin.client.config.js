'use strict';

// Configuring the Articles module
angular.module('admin').run(['Menus',
	function(Menus) {
		// Add the articles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Admin',
			state: 'admin',
			type: 'dropdown',
			roles: ['admin']
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'admin', {
			title: 'List Users',
			state: 'admin.list'
		});
	}
]);

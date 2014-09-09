'use strict';

// Configuring the Articles module
angular.module('timesheets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Timesheets', 'timesheets', 'dropdown', '/timesheets(/create)?');
		Menus.addSubMenuItem('topbar', 'timesheets', 'List Timesheets', 'timesheets');
		Menus.addSubMenuItem('topbar', 'timesheets', 'New Timesheet', 'timesheets/create');
	}
]);
'use strict';

//Setting up route
angular.module('timesheets').config(['$stateProvider',
	function($stateProvider) {
		// Timesheets state routing
		$stateProvider.
		state('listTimesheets', {
			url: '/timesheets',
			templateUrl: 'modules/timesheets/views/list-timesheets.client.view.html'
		}).
		state('createTimesheet', {
			url: '/timesheets/create',
			templateUrl: 'modules/timesheets/views/create-timesheet.client.view.html'
		}).
		state('viewTimesheet', {
			url: '/timesheets/:timesheetId',
			templateUrl: 'modules/timesheets/views/view-timesheet.client.view.html'
		}).
		state('editTimesheet', {
			url: '/timesheets/:timesheetId/edit',
			templateUrl: 'modules/timesheets/views/edit-timesheet.client.view.html'
		});
	}
]);
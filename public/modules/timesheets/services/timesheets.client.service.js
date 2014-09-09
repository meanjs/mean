'use strict';

//Timesheets service used to communicate Timesheets REST endpoints
angular.module('timesheets').factory('Timesheets', ['$resource',
	function($resource) {
		return $resource('timesheets/:timesheetId', { timesheetId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
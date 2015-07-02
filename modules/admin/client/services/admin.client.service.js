'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('admin').factory('Admin', ['$resource',
	function ($resource) {
		return $resource('api/users/:userId', {
			userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

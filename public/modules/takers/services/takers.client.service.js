'use strict';

//Takers service used to communicate Takers REST endpoints
angular.module('takers').factory('Takers', ['$resource',
	function($resource) {
		return $resource('takers/:takerId', { takerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
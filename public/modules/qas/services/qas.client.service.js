'use strict';

//Qas service used to communicate Qas REST endpoints
angular.module('qas').factory('Qas', ['$resource',
	function($resource) {
		return $resource('qas/:qaId', { qaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
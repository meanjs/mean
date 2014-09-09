'use strict';

//Vendors service used to communicate Vendors REST endpoints
angular.module('vendors').factory('Vendors', ['$resource',
	function($resource) {
		return $resource('vendors/:vendorId', { vendorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
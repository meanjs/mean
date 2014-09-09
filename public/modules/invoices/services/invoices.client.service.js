'use strict';

//Invoices service used to communicate Invoices REST endpoints
angular.module('invoices').factory('Invoices', ['$resource',
	function($resource) {
		return $resource('invoices/:invoiceId', { invoiceId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
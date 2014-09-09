'use strict';

//Expenses service used to communicate Expenses REST endpoints
angular.module('expenses').factory('Expenses', ['$resource',
	function($resource) {
		return $resource('expenses/:expenseId', { expenseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Quizzes service used to communicate Quizzes REST endpoints
angular.module('quizzes').factory('Quizzes', ['$resource',
	function($resource) {
		return $resource('quizzes/:quizId', { quizId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
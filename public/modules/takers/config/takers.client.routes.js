'use strict';

//Setting up route
angular.module('takers').config(['$stateProvider',
	function($stateProvider) {
		// Takers state routing
		$stateProvider.
			state('listTakers', {
				url: '/takers',
				templateUrl: 'modules/takers/views/take.html'
			}).

			state('takers', {
				url: '/takers',
				templateUrl: 'modules/takers/views/take.html'
			}).

		state('createTaker', {
			url: '/takers/create',
			templateUrl: 'modules/takers/views/create-taker.client.view.html'
		}).

		state('viewTaker', {
			url: '/takers/:takerId',
			templateUrl: 'modules/takers/views/view-taker.client.view.html'
		}).
		state('editTaker', {
			url: '/takers/:takerId/edit',
			templateUrl: 'modules/takers/views/edit-taker.client.view.html'
		}).
		state('listTakersQuizzes', {
			url: '/listTakersQuizzes',
			templateUrl: 'modules/takers/views/listquizzes-takers.client.view.html'
		});

	}
]);

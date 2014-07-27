'use strict';

//Setting up route
angular.module('takers').config(['$stateProvider',
	function($stateProvider) {
		// Takers state routing
		$stateProvider.
		state('listTakers', {
			url: '/takers',
			templateUrl: 'modules/takers/views/list-takers.client.view.html'
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
		});
	}
]);
'use strict';

// Setting up route
angular.module('mean.users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/signup.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/signin.html'
		});
	}
]);
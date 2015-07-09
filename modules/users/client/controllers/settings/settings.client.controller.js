'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');
	}
]);

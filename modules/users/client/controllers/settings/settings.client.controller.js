'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		$scope.user = Authentication.user;
	}
]);

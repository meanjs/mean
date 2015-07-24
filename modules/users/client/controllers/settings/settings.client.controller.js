'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.user = Authentication.user;
	}
]);

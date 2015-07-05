'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$preloadProvider', function($preloadProvider) {
	var auth = {
		user: $preloadProvider.user
	};
	
	return auth;
}]);

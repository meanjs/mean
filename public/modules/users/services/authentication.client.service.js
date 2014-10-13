'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$preloadProvider', function($preloadProvider) {
	var _this = this;

	_this._data = {
		user: $preloadProvider.user
	};

	return _this._data;
}]);

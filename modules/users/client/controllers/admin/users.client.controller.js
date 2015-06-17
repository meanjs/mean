'use strict';

angular.module('users').controller('AdminUsersController', ['$scope', 'Users', 'Authentication',
	function ($scope, Users, Authentication) {

		$scope.rows = Users.query();

		$scope.identityToLink = function (identity) {
			return 'noneYet';
		};

	}
]);

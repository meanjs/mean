'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
	function ($scope, $filter, Admin) {

		$scope.users = [];

		Admin.query(function (data) {
			$scope.users = data;
		});
	}
]);

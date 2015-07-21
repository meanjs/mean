'use strict';

angular.module('admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
	function ($scope, $state, Authentication, userResolve) {
		$scope.authentication = Authentication;
		$scope.user = userResolve;

		$scope.remove = function (user) {
			if (confirm('Are you sure you want to delete this user?')) {
				if (user) {
					user.$remove();

					$scope.users.splice($scope.users.indexOf(user), 1);
				} else {
					$scope.user.$remove(function () {
						$state.go('admin.users');
					});
				}
			}
		};

		$scope.update = function () {
			var user = $scope.user;

			user.$update(function () {
				$state.go('admin.user', {
					userId: user._id
				});
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

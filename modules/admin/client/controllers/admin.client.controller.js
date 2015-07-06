'use strict';

angular.module('admin').controller('AdminController', ['$scope', '$stateParams', '$state', '$filter', 'Authentication', 'Admin',
	function($scope, $stateParams, $state, $filter, Authentication, Admin) {
		$scope.authentication = Authentication;

		$scope.remove = function(user) {
			if(confirm('Are you sure you want to delete this user?')) {
				if (user) {
					user.$remove();

					$scope.users.splice($scope.users.indexOf(user),1);

				} else {
					$scope.user.$remove(function() {
						$state.go('admin.users');
					});
				}
			}
		};

		$scope.update = function() {
			var user = $scope.user;

			user.$update(function() {
				$state.go('admin.user', { userId: user._id });
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			 Admin.query(function (data) {
				 $scope.users = data;
				$scope.buildPager();
			});
		};

		$scope.findOne = function() {
			$scope.user = Admin.get({
				userId: $stateParams.userId
			});
		};

		$scope.buildPager = function () {
			$scope.pagedItems = [];
			$scope.itemsPerPage = 15;
			$scope.currentPage = 1;
			$scope.figureOutItemsToDisplay();
		};

		$scope.figureOutItemsToDisplay = function () {
			$scope.filteredItems = $filter('filter')($scope.users, { $: $scope.search});
			$scope.filterLength = $scope.filteredItems.length;
			var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
			var end = begin + $scope.itemsPerPage;
			$scope.pagedItems = $scope.filteredItems.slice(begin, end);
		};

		$scope.pageChanged = function() {
			$scope.figureOutItemsToDisplay();
		};
	}
]);

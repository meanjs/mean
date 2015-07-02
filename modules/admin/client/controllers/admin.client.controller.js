'use strict';

angular.module('admin').controller('AdminController', ['$scope', '$stateParams', '$state', '$filter', '$location', 'Authentication', 'Admin',
	function($scope, $stateParams, $state, $filter, $location, Authentication, Admin) {
		$scope.authentication = Authentication;
		/*
		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
		*/
		$scope.remove = function(user) {
			if(confirm('Are you sure you want to delete this user?')) {
				if (user) {
					user.$remove();

					$scope.adminusers.splice($scope.adminusers.indexOf(user),1);

				} else {
					$scope.adminuser.$remove(function() {
						$state.go('admin.list');
					});
				}
			}
		};

		$scope.update = function() {
			var user = $scope.adminuser;

			user.$update(function() {
				$location.path('admin/' + user._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			 Admin.query(function (data) {
				 $scope.adminusers = data;
				$scope.buildPager();
			});
		};

		$scope.findOne = function() {
			$scope.adminuser = Admin.get({
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
			$scope.filteredItems = $filter('filter')($scope.adminusers, { $: $scope.search});
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

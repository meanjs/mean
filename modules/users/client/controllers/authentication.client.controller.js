'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function ($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// Get an eventual error defined in the URL query string:
		$scope.error = $location.search().err;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function () {
			$http.post('/api/auth/signup', $scope.credentials).success(function (response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function (response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function () {
			$http.post('/api/auth/signin', $scope.credentials).success(function (response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function (response) {
				$scope.error = response.message;
			});
		};
	}
]);

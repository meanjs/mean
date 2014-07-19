'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
    function($scope, $stateParams, $http, $location, Authentication) {
        $scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function(isValid) {
			if (isValid){
				$http.post('/auth/signup', $scope.credentials).success(function(response) {
					//If successful we assign the response to the global user model
					$scope.authentication.user = response;
	
					//And redirect to the index page
					$location.path('/');
				}).error(function(response) {
					$scope.error = response.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				//If successful we assign the response to the global user model
				$scope.authentication.user = response;

                //And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.forgot = function() {
            $scope.success = $scope.error = null;

            $http.post('/auth/forgot', $scope.credentials).success(function(response) {
                // Show user success message and clear form
                $scope.credentials = null;
                $scope.success = response.message;

            }).error(function(response) {
                // Show user error message and clear form
                $scope.credentials = null;
                $scope.error = response.message;
            });
        };

        // Change user password
        $scope.reset = function() {
            $scope.success = $scope.error = null;

            $http.post('/auth/reset/' + $stateParams.token, 
                            $scope.passwordDetails).success(function(response) {
                
                // If successful show success message and clear form
                $scope.success = response.message;
                $scope.passwordDetails = null;

            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);

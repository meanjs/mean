'use strict';

angular.module('mean.system').controller('AuthenticationController', ['$scope', '$http', '$location', 'Global',
    function($scope, $http, $location, Global) {
        $scope.global = Global;

        $scope.signup = function() {
            $http.post('/auth/signup', $scope.credentials).success(function(data, status, headers, config) {
                //If successful we assign the data to the global user model
                $scope.global.user = data;

                //And redirect to the index page
                $location.path('/');
            }).error(function(data, status, headers, config) {
                $scope.error = data.message;
            });
        };

        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(data, status, headers, config) {
                //If successful we assign the data to the global user model
                $scope.global.user = data;

                //And redirect to the index page
                $location.path('/');
            }).error(function(data, status, headers, config) {
                $scope.error = data.message;
            });
        };
    }
]);
'use strict';

angular.module('users').controller('DeleteProfileController', ['$scope', '$http', '$state', '$location', 'Users', 'Authentication',
  function ($scope, $http, $state, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.deleteUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      var users = {
        username: $scope.username,
        password: $scope.password
      };

      user.$delete(users)
          .then(function (response) {
            $scope.$broadcast('show-errors-reset', 'userForm');

            $scope.success = true;
            Authentication.user = response;

            $http.get('/api/auth/signout').success(function (response) {
              // If successful we assign the response to the global user model
              Authentication.user = response;

              // And redirect to the previous or home page
              $state.go($state.previous.state.name || 'home', $state.previous.params);
            }).error(function (response) {
              $scope.error = response.message;
            });

          }, function(error) {
            //otherwise display the error
            $scope.error = 'Unable to delete user!';
          });
    };
  }
]);

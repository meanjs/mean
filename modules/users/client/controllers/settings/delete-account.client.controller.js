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
            console.log(response);

            $scope.success = true;

            $http.get('/api/auth/signout').success(function (response) {

              // Set the response to undefined to trigger action in Home controller
              response = undefined;
              Authentication.user = response;

              // Navigate back to the home state after successful delete and sign out
              $state.go($state.previous.state.name || 'home', $state.previous.params);
            });


          }, function(error) {
            // Otherwise display the error
            $scope.error = 'Unable to delete user!';
          });
    };
  }
]);

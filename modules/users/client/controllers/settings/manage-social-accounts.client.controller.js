'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are social accounts
    $scope.hasConnectedSocialAccounts = function() {
      if ($scope.user.providers) {
        for(var prop in $scope.user.providers) {
          if ($scope.user.providers.hasOwnProperty(prop)) {
            return true;
          }
        }
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function(provider) {
      return $scope.user.providers && $scope.user.providers[provider];
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

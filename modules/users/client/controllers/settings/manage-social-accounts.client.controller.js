'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function ($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// Check if there are additional accounts
		$scope.hasConnectedAdditionalSocialAccounts = function (provider) {
			return true;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function (provider) {
			var has = false;
			angular.forEach($scope.user.identities, function (identity) {
				if (identity.provider === provider) {
					has = true;
				}
			});
			return has;
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function (provider, id) {
			$scope.success = $scope.error = null;

			$http.delete('/api/users/accounts', {
				params: {
					provider: provider,
					id: id
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

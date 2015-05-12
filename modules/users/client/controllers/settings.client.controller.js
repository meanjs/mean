'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function ($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;
		$scope.linkedProviders = [];

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		$scope.user.identities.forEach(function (identity) {
			if (identity.provider === 'username') {
				$scope.user.username = identity.id;
			}
		});

		$scope.identitiesToEmails = function () {
			$scope.user.emails = [];
			if ($scope.user.identities) {
				$scope.user.identities.forEach(function (identity, idx) {
					if (identity.provider === 'email') {
						$scope.user.identities.splice(idx, 1);
						$scope.user.emails.push(identity);
					}
				});
			}
		};
		$scope.identitiesToEmails();

		$scope.removeEmail = function (emailIndex) {
			$scope.user.emails.splice(emailIndex, 1);
			return false;
		};

		$scope.addEmail = function () {
			if (!$scope.user.identities) {
				$scope.user.identities = [];
			}
			$scope.user.emails.push({
				provider: 'email',
				id: ''
			});
		};

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function (provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function (provider) {
			var connected = false;
			angular.forEach($scope.user.identities, function (identity) {
				if (identity.provider === provider) {
					connected = true;
					$scope.linkedProviders.push(provider);
				}
			});
			return connected;
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

		// Update a user profile
		$scope.updateUserProfile = function (isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;

				$scope.user.emails.forEach(function (email) {
					$scope.user.identities.push(email);
				});
				delete $scope.user.emails;

				var user = new Users($scope.user);

				user.$update(function (response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.identitiesToEmails();
				}, function (response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function () {
			$scope.success = $scope.error = null;

			$http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function (response) {
				$scope.error = response.message;
			});
		};
	}
]);

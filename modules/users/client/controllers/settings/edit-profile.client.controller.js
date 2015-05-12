'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function ($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// Update a user profile
		$scope.updateUserProfile = function (isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function (response) {
					$scope.success = true;
					Authentication.user = response;
				}, function (response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

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
	}
]);

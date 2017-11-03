(function () {
  'use strict';

  angular
    .module('users')
    .controller('AdminAuthenticationController', AdminAuthenticationController);

  AdminAuthenticationController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification'];

  function AdminAuthenticationController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    $scope.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    $scope.newFirstName = null;
    $scope.newLastName = null;
    $scope.newEmail = null;
    $scope.newUsername = null;
    $scope.newPassword = null;
    $scope.isStudentRole = true;
    $scope.isSponsorRole = false;

    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({ message: $location.search().err });
    }

    // If not admin redirect back
    if (vm.authentication.user == null) {
      $state.go('authentication.signin');
    } else if (vm.authentication.user.type !== 'admin') {
      $state.go('home');
    }

    $scope.signup = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var userType = 'student';
      if ($scope.isSponsorRole) {
        userType = 'sponsor';
      }

      var credentials = {
        firstName: $scope.newFirstName,
        lastName: $scope.newLastName,
        email: $scope.newEmail,
        username: $scope.newUsername,
        password: $scope.newPassword,
        type: userType
      };

      UsersService.userSignup(credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    };

    // Authentication Callbacks
    function onUserSignupSuccess(response) {
      // If successful we do nothing
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
      // should not redirect either to allow for mass signups
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }

    $scope.switchRoles = function () {
      var studentRole = document.getElementById('studentRole');
      var sponsorRole = document.getElementById('sponsorRole');

      if ($scope.isStudentRole && sponsorRole.checked) {
        $scope.isStudentRole = false;
        studentRole.checked = false;
        $scope.isSponsorRole = true;
        sponsorRole.checked = true;
      } else if ($scope.isSponsorRole && studentRole.checked) {
        $scope.isStudentRole = true;
        studentRole.checked = true;
        $scope.isSponsorRole = false;
        sponsorRole.checked = false;
      } else {
        studentRole.checked = $scope.isStudentRole;
        sponsorRole.checked = $scope.isSponsorRole;
      }
    };
  }
}());

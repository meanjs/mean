// Controller for when admin addes new users ot the databases
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

// Defines the variables that will go in to the user schema
    $scope.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    $scope.newFirstName = null;
    $scope.newLastName = null;
    $scope.newEmail = null;
    $scope.newUsername = null;
    $scope.newPassword = null;
    $scope.isStudentRole = true;
    $scope.isSponsorRole = false;
    $scope.isAdminRole = false;

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
      } else if ($scope.isAdminRole) {
        userType = 'admin';
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
      // should clear fields
      $scope.newFirstName = null;
      $scope.newLastName = null;
      $scope.newEmail = null;
      $scope.newUsername = null;
      $scope.newPassword = null;
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }

// Function that changes the type of user the added user will be depending on the chekced box in the html
    $scope.switchRoles = function () {
      var studentRole = document.getElementById('studentRole');
      var sponsorRole = document.getElementById('sponsorRole');
      var adminRole = document.getElementById('adminRole');

      if ($scope.isStudentRole && (sponsorRole.checked || adminRole.checked)) {
        $scope.isStudentRole = false;
        studentRole.checked = false;
        if (sponsorRole.checked) {
          $scope.isSponsorRole = true;
          sponsorRole.checked = true;
          $scope.isAdminRole = false;
          adminRole.checked = false;
        } else if (adminRole.checked) {
          $scope.isAdminRole = true;
          adminRole.checked = true;
          $scope.isSponsorRole = false;
          sponsorRole.checked = false;
        }
      } else if ($scope.isSponsorRole && (studentRole.checked || adminRole.checked)) {
        $scope.isSponsorRole = false;
        sponsorRole.checked = false;
        if (studentRole.checked) {
          $scope.isStudentRole = true;
          studentRole.checked = true;
          $scope.isAdminRole = false;
          adminRole.checked = false;
        } else if (adminRole.checked) {
          $scope.isAdminRole = true;
          adminRole.checked = true;
          $scope.isStudentRole = false;
          studentRole.checked = false;
        }
      } else if ($scope.isAdminRole && (studentRole.checked || sponsorRole.checked)) {
        $scope.isAdminRole = false;
        adminRole.checked = false;
        if (studentRole.checked) {
          $scope.isStudentRole = true;
          studentRole.checked = true;
          $scope.isAdminRole = false;
          adminRole.checked = false;
        } else if (sponsorRole.checked) {
          $scope.isSponsorRole = true;
          sponsorRole.checked = true;
          $scope.isAdminRole = false;
          adminRole.checked = false;
        }
      } else {
        studentRole.checked = $scope.isStudentRole;
        sponsorRole.checked = $scope.isSponsorRole;
        adminRole.checked = $scope.isAdminRole;
      }
    };
  }
}());

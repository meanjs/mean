(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification'];

  function EditProfileController($scope, $http, $location, UsersService, Authentication, Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;

    // TESTING
    var hello = "yo";
    UsersService.testing(hello)
        .then(success)
        .catch(failure);

    function success(response) {
      console.log('worked!');
      console.log(response);
    }

    function failure(response) {
      console.log('sadness')
      console.log(response);
    }
    // END TESTING

    // Update a user profile
    function updateUserProfile(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!' });
        Authentication.user = response;
      }, function (response) {
        Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!' });
      });
    }
  }
}());

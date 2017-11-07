(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$state', '$http', '$location', 'UsersService', 'Authentication', 'Notification'];

  function EditProfileController($scope, $state, $http, $location, UsersService, Authentication, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;

    console.log('user: ');
    console.log(vm.user);

    if (vm.authentication.user === null) {
      $state.go('authentication.signin');
    }
    if (vm.authentication.user.type !== 'student') {
      $state.go('home');
    }

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

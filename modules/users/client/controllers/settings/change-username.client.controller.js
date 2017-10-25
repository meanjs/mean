(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangeUsernameController', ChangeUsernameController);

  ChangeUsernameController.$inject = ['$scope', '$http', 'Authentication', 'UsersService', 'PasswordValidator', 'Notification'];

  function ChangeUsernameController($scope, $http, Authentication, UsersService, PasswordValidator, Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.changeUserPassword = changeUserPassword;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // Change user password
    function changeUserUsername(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.usernameForm');

        return false;
      }

      UsersService.changeUserPassword(vm.usernameDetails)
        .then(onChangeUsernameSuccess)
        .catch(onChangeUsernameError);
    }

    function onChangeUsernameSuccess(response) {
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Username Changed Successfully' });
      vm.usernameDetails = null;
    }

    function onChangeUsernameError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Username change failed!' });
    }
  }
}());

((() => {
  angular
    .module('users')
    .controller('ChangePasswordController', ChangePasswordController);

  ChangePasswordController.$inject = ['$scope', '$http', 'Authentication', 'UsersService', 'PasswordValidator', 'Notification'];

  function ChangePasswordController($scope, $http, Authentication, UsersService, PasswordValidator, Notification) {
    const vm = this;

    vm.user = Authentication.user;
    vm.changeUserPassword = changeUserPassword;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // Change user password
    function changeUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');

        return false;
      }

      UsersService.changePassword(vm.passwordDetails)
        .then(onChangePasswordSuccess)
        .catch(onChangePasswordError);
    }

    function onChangePasswordSuccess(response) {
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password Changed Successfully' });
      vm.passwordDetails = null;
    }

    function onChangePasswordError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Password change failed!' });
    }
  }
})());

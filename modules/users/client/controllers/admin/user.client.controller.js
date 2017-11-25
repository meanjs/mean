(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'AdminModulesService'];

  function UserController($scope, $state, $window, Authentication, user, Notification, AdminModulesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.update = update;
    vm.changeRole = changeRole;
    vm.isContextUserSelf = isContextUserSelf;
    vm.role = null;

    $scope.modules = AdminModulesService.query();

    $scope.roleOptions = [{
      id: 'ta', //Name will be displayed in the html, id will be used on the database.
      name: 'TA'
    },
    {
      id: 'technician',
      name: 'Technician'
    },
    {
      id: 'superta',
      name: 'Super-TA'
    },
    {
      id: 'admin',
      name: 'Admin'
    }
  ];

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }
      var user = vm.user;
      user.roles = vm.role;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }

    function changeRole(roleChange) {
      vm.role = roleChange.id;
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());

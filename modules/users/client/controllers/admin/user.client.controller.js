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
    vm.modifyTAModules = modifyTAModules;
    vm.role = null;
    vm.modulesTA = [];

    $scope.modules = AdminModulesService.query();

    //Name will be displayed in the html, id will be used on the database.
    $scope.roleOptions = [{
      id: 'ta',
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

    //Remove the user by deleting from the DB and the view.
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

    //Update the user's info by updating it in the DB.
    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }
      var user = vm.user;
      user.roles = vm.role;
      user.modulesTaught = vm.modulesTA;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }

    //Converting roles shown from the front end to the roles shown on the schema.
    function changeRole(roleChange) {
      vm.role = roleChange.id;
    }

    //Adding and removing modules that the TAs teach based on the number of checkboxes checked.
    function modifyTAModules(module, checked) {
      if(checked) {
        vm.modulesTA.push(module.title);
      } else {
        var index = vm.modulesTA.indexOf(module.title);
        if(index > -1)
          vm.modulesTA.splice(index, 1);
      }
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());

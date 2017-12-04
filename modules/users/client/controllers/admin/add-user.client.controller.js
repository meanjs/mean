(function () {
  'use strict';

  angular
    .module('users')
    .controller('AddUserController', AddUserController);

  AddUserController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Notification', 'ApplicantsService', 'AdminModulesService'];

  function AddUserController($scope, $state, UsersService, $location, $window, Notification, ApplicantsService, AdminModulesService) {
    var vm = this;

    vm.signup = signup;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    vm.modifyTAModules = modifyTAModules;
    vm.modulesTA = [];
    $scope.modules = AdminModulesService.query();

    //Signing up the user by validating credentials
    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      vm.credentials.roles = alterRole(vm.credentials.roles);
      vm.credentials.modulesTaught = vm.modulesTA;

      ApplicantsService.adminSignup(vm.credentials)
        .then(onAddUserSuccess)
        .catch(onAddUserError);
    }

    //Show a toast to the user for successfully signing up.
    function onAddUserSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    //Show a toast to the user telling him or her that there were errors in signing up.
    function onAddUserError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Add User Error!', delay: 6000 });
    }

    //Converting roles shown from the front end to the roles shown on the schema.
    function alterRole (role) {
      if(role == 'TA')
        return 'ta';
      if(role == 'seniorTA')
        return 'superta';
      else
        return role;
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

  }
}());

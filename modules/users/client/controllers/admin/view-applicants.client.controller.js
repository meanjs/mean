(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('ViewApplicantsController', ViewApplicantsController);

  ViewApplicantsController.$inject = ['$scope', '$filter', 'ApplicantsService'];


  function ViewApplicantsController($scope, $filter, ApplicantsService) {
    var vm = this;
    ApplicantsService
      .query(function (data) {
        vm.unapprovedUsers = data;
      });


    vm.removeApplicant = function (user) {
      if (user) {
          user.$remove(); //This database call isn't working.
          vm.unapprovedUsers.splice(vm.unapprovedUsers.indexOf(user), 1);
          Notification.success('User deleted successfully!');
      } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
    };

    vm.approve = function (user) {
      if (user) {
          var newUser = user;
          user.approvedStatus = true;
          user.$update(newUser); //This database call isn't working.
          vm.unapprovedUsers.splice(vm.unapprovedUsers.indexOf(user), 1);
          Notification.success('User approved successfully!');
      } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User approved successfully!' });
          });
        }
    };

    vm.approveAll = function () {
      for(var i=0; i<vm.unapprovedUsers.length; i++){
        vm.approve(vm.unapprovedUsers[i]);
      }
    };
  }
}());

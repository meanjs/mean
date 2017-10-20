(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('ViewApplicantsController', ViewApplicantsController);

  ViewApplicantsController.$inject = ['$scope', '$filter', '$window', 'ApplicantsService', 'Notification'];


  function ViewApplicantsController($scope, $filter, $window, ApplicantsService, Notification) {
    var vm = this;
    ApplicantsService
      .query(function (data) {
        vm.unapprovedUsers = data;
      });


    vm.removeApplicant = function (user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          vm.unapprovedUsers.splice(vm.unapprovedUsers.indexOf(user), 1);
          ApplicantsService.remove(user);
          Notification.success('User deleted successfully!');
        }
      }
    };

    vm.approve = function (user) {
      if (user) {
          //user.approvedStatus = true; //We let the backend handle the status update and just pass in the current user.
          console.log(ApplicantsService.remove);
          ApplicantsService.approve(user); //This database call isn't working.
          Notification.success('User approval changed successfully!');
      }
    };

    vm.approveAll = function () {
      for(var i=0; i<vm.unapprovedUsers.length; i++){
        vm.approve(vm.unapprovedUsers[i]);
      }
    };
  }
}());

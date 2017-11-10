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

    vm.roleOptions = [{
      id: "ta",
      name: "TA"
    },
    {
      id: "technician",
      name: "Technician"
    },
    {
      id: "superta",
      name: "Super-TA"
    },
    {
      id: "admin",
      name: "Admin"
    }
  ];

    vm.removeApplicant = function (user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          vm.unapprovedUsers.splice(vm.unapprovedUsers.indexOf(user), 1);
          ApplicantsService.remove(user);
          Notification.success('User deleted successfully!');
        }
      }
    };

    vm.approveUser = function (user) {
      if (user) {
          var newUser = user;
          user.approvedStatus = true;
          user.roles = user.roles.id;
          ApplicantsService.changeToAccepted(newUser);
          vm.unapprovedUsers.splice(vm.unapprovedUsers.indexOf(user), 1);
          Notification.success('User approved successfully!');
      }
    };

    vm.modifyRoles = function(applicant) {
      if (applicant.roles.indexOf('admin') != -1)
          return 'Admin';
      if (applicant.roles.indexOf('superta') != -1 )
        return 'Super TA';
      if (applicant.roles.indexOf('technician') != -1 )
        return 'Technician';
      if (applicant.roles.indexOf('ta') != -1 )
        return 'TA';
      return 'User';

    }

    vm.approveAll = function () {
      for(var i=0; i<vm.unapprovedUsers.length; i++){
        vm.approveUser(vm.unapprovedUsers[i]);
      }
    };
  }
}());

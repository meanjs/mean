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
      id: "ta", //Name will be displayed in the html, id will be used on the database.
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
          ApplicantsService.remove(user);
          vm.unapprovedUsers.splice(vm.unapprovedUsers.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        }
      }
    };

    vm.approveUser = function (user) {
      if (user) {
          var newUser = user;
          user.approvedStatus = true;
          user.roles = user.roles.id; //We want to drop the user.roles.name contents and just use the db-friendly variable.
          ApplicantsService.changeToAccepted(newUser);
          vm.unapprovedUsers.splice(vm.unapprovedUsers.indexOf(user), 1);
          Notification.success('User approved successfully!');
      }
    };

    vm.approveAll = function () {
      for(var i=vm.unapprovedUsers.length-1; i>=-1; i--){ //This indexing might look a little weird but it wasn't working without it, so idk.
        vm.approveUser(vm.unapprovedUsers[i]);
      }
    };
  }
}());

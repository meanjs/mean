(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('ViewApplicantsController', ViewApplicantsController);

  ViewApplicantsController.$inject = ['$scope', '$state', '$filter', 'AdminService'];

  function ViewApplicantsController($scope, $filter, AdminService, user) {

    var vm = this;
    vm.user = user;
    vm.checkAllApproved = false;

    /* vm.applicants = [
      {
        'name': 'Kevin B',
        'role': 'Student',
        'approved': false
      },
      {
        'name': 'Sam S',
        'role': 'TA',
        'approved': false
      },
      {
        'name': 'Richard',
        'role': 'Technician',
        'approved': false
      },
      {
        'name': 'Peter',
        'role': 'Student',
        'approved': false
      },
      {
        'name': 'Bob',
        'role': 'Student',
        'approved': false
      }
    ];*/

    vm.approveAll = function () {
      if (vm.checkAllApproved) {
        for (var i = 0; i < vm.applicants.length; i++) {
          vm.applicants[i].approved = true;
        }
      }
    };

    vm.changeApproveState = function (applicant) {
      if (applicant.approved)
        applicant.approved = !applicant.approved;
      else
        applicant.approved = !applicant.approved;
    };

    vm.deleteApplicant = function (applicant) {
      var deleteApplicant = vm.applicants.indexOf(applicant);
      if (deleteApplicant !== -1)
        vm.applicants.splice(deleteApplicant, 1);
    };

  }
}());

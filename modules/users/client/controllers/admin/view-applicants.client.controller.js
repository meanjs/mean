(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('ViewApplicantsController', ViewApplicantsController);

  ViewApplicantsController.$inject = ['$scope', '$filter', 'AdminService'];

  function ViewApplicantsController($scope, $filter, AdminService) {

    var vm = this;

    vm.checkAllApproved = false;

    vm.applicants = [
      {
        'name': 'Kevin B',
        'role': 'Student',
        'approved': false,
        'declined': false
      },
      {
        'name': 'Sam S',
        'role': 'TA',
        'approved': false,
        'declined': false
      },
      {
        'name': 'Richard',
        'role': 'Technician',
        'approved': false,
        'declined': false
      },
      {
        'name': 'Peter',
        'role': 'Student',
        'approved': false,
        'declined': false
      },
      {
        'name': 'Bob',
        'role': 'Student',
        'approved': false,
        'declined': false
      }
    ];

    vm.approveAll = function () {
      if (vm.checkAllApproved) {
        for (var i = 0; i < vm.applicants.length; i++) {
          vm.applicants[i].approved = true;
          vm.applicants[i].declined = false;
        }
      }
    };

    vm.changeDeclineState = function (applicant) {
      if (applicant.declined)
        applicant.declined = false;
      else
        applicant.declined = true;
      if (applicant.declined)
        applicant.approved = false;
    };

    vm.changeApproveState = function (applicant) {
      if (applicant.approved)
        applicant.approved = false;
      else
        applicant.approved = true;
      if (applicant.approved)
        applicant.declined = false;
    };
  }
}());

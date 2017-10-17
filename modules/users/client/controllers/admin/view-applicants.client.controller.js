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


    vm.removeApplicant = function (applicant) {
      var unapprovedUser = vm.unapprovedUsers.indexOf(applicant);
      ApplicantsService.delete(123);
      vm.unapprovedUsers.splice(unapprovedUser, 1);
    };

    vm.changeApproveState = function (applicant) {
      //var unapprovedUser = vm.unapprovedUsers.indexOf(applicant);
      ApplicantsService.put(applicant);
    };

    vm.checkAllApproved = function () {
    };

  }
}());

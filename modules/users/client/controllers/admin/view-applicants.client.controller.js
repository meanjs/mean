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
      applicant.deleteApplicant();
      vm.unapprovedUsers.splice(vm.unapprovedUsers.indexOf(applicant), 1);
    };

    vm.changeStatus = function (applicant) {
      applicant.updateApproval();
    };

    vm.checkAllApproved = function(){
      
    }

  }
}());

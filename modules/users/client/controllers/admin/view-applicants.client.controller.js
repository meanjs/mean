(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('ViewApplicantsController', ViewApplicantsController);

  ViewApplicantsController.$inject = ['$scope', '$filter', 'ApplicantsService'];


  function ViewApplicantsController($scope, $filter, ApplicantsService) {
    var vm = this;
    
    ApplicantsService
      .query(function(data) {
        vm.unapprovedUsers = data;
      });

  }
}());

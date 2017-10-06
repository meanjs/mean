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
        "name": "Kevin B",
        "approved": false,
        "declined": false
      },
      {
        "name": "Sam S",
        "approved": false,
        "declined": false
      },
      {
        "name": "Richard",
        "approved": false,
        "declined": false
      },
      {
        "name": "Peter",
        "approved": false,
        "declined": false
      },
      {
        "name": "Bob",
        "approved": false,
        "declined": false
      }
    ];

    vm.approveAll = function () {
      if (vm.checkAllApproved) {
        for (var i = 0; i < vm.applicants.length; i++) {
          vm.applicants[i].approved = true;
        }
      }
    };

    /* var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    AdminService.query(function (data) {
      vm.users = data;
      vm.buildPager();//
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }*/
  }
}());

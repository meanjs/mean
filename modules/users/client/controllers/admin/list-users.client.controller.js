(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'AdminService', 'ApplicantsService'];

  function UserListController($scope, $filter, AdminService, ApplicantsService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    AdminService.query(function (data) {
      vm.users = data;
      vm.buildPager();
    });

    ApplicantsService.query(function (data) {
      vm.applicants = data;
    })

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

    vm.modifyRoles = function(user) {
      if (user.roles.indexOf('admin') != -1)
          return 'Admin';
      if (user.roles.indexOf('superta') != -1 )
        return 'Super TA';
      if (user.roles.indexOf('technician') != -1 )
        return 'Technician';
      if (user.roles.indexOf('ta') != -1 )
        return 'TA';
      return 'User';
    };

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

  }
}());

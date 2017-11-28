(function () {
  'use strict';

  angular
    .module('users')
    .controller('TAUserListController', TAUserListController);

  TAUserListController.$inject = ['$scope', '$filter', 'AdminService'];

  function TAUserListController($scope, $filter, AdminService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.modifyRoles = modifyRoles;

    AdminService.query(function (data) {
      vm.users = data;
      vm.buildPager();
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

    function modifyRoles(user) {
      if (user.roles.indexOf('admin') != -1)
          return 'Admin';
      if (user.roles.indexOf('superta') != -1 )
        return 'Super TA';
      if (user.roles.indexOf('technician') != -1 )
        return 'Technician';
      if (user.roles.indexOf('ta') != -1 )
        return 'TA';
      return 'User';
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }


  }
}());

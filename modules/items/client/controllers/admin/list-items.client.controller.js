(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminListController', ItemsAdminListController);

  ItemsAdminListController.$inject = ['ItemsService'];

  function ItemsAdminListController(ItemsService) {
    var vm = this;

    vm.items = ItemsService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('items')
    .controller('ItemsListController', ItemsListController);

  ItemsListController.$inject = ['ItemsService'];

  function ItemsListController(ItemsService) {
    var vm = this;

    vm.items = ItemsService.query();
    console.log("Logging items");
    console.log(vm.items);
  }
}());

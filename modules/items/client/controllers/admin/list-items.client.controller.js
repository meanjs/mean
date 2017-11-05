(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminListController', ItemsAdminListController);

  ItemsAdminListController.$inject = ['ItemsService', 'CategoriesService'];

  function ItemsAdminListController(ItemsService, CategoriesService) {
    var vm = this;

    vm.items = ItemsService.query();
    vm.categories = CategoriesService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminCategoriesController', ItemsAdminCategoriesController);

  ItemsAdminCategoriesController.$inject = ['ItemsService'];

  function ItemsAdminCategoriesController(ItemsService) {
    var vm = this;

  }
}());

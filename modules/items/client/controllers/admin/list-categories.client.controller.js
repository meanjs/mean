(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminCategoriesController', ItemsAdminCategoriesController);

  ItemsAdminCategoriesController.$inject = ['ItemsService', 'CategoriesService'];

  function ItemsAdminCategoriesController(ItemsService, CategoriesService) {
    var vm = this;

    vm.categories= CategoriesService.query()

    vm.deleteCategory = function(category){
    	vm.categories.splice(vm.categories.indexOf(category), 1);
    }

  }
}());

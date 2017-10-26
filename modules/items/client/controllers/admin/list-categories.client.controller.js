(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminCategoriesController', ItemsAdminCategoriesController);

  ItemsAdminCategoriesController.$inject = ['ItemsService'];

  function ItemsAdminCategoriesController(ItemsService) {
    var vm = this;

    vm.categories= [
    	{
    		name: "Category 1"
    	},
    	{
    		name: "Category 2"
    	},
    	{
    		name: "Cateogry 3"
    	},
    	{
    		name: "Category 4"
    	}
    ];

    vm.deleteCategory = function(category){
    	vm.categories.splice(vm.categories.indexOf(category), 1);
    }

  }
}());

(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminModulesController', ItemsAdminModulesController);

  //ItemsAdminModulesController.$inject = ['ItemsService'];

  function ItemsAdminModulesController(ItemsService) {
    var vm = this;

    vm.modules = [
    	{
    		name: "Module 1"
    	},
    	{
    		name: "Module 2"
    	},
    	{
    		name: "Module 3"
    	},
    	{
    		name: "Module 4"
    	}
    ];

    vm.deleteModule = function(module){
    	vm.modules.splice(vm.modules.indexOf(module), 1);
    }

  }
}());

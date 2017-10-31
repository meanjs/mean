(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminModulesController', ItemsAdminModulesController);

  ItemsAdminModulesController.$inject = ['ItemsService', 'ModulesService'];

  function ItemsAdminModulesController(ItemsService, ModulesService) {
    var vm = this;

    vm.modules = ModulesService.query();

    vm.deleteModule = function(module){
    	vm.modules.splice(vm.modules.indexOf(module), 1);
    }

  }
}());

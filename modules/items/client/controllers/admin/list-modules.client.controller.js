(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminModulesController', ItemsAdminModulesController);

  ItemsAdminModulesController.$inject = ['ItemsService', 'ModulesService'];

  function ItemsAdminModulesController(ItemsService, ModulesService) {
    var vm = this;

    vm.modules = ModulesService.query();

    vm.remove = function(module){
      vm.modules.splice(vm.modules.indexOf(module), 1);
      //Call backend delete here.
      vm.mod.$remove(function () {
          $state.go('admin.items.modules');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item deleted successfully!' });
        });
    }

  }
}());

(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminModulesController', ItemsAdminModulesController);

  ItemsAdminModulesController.$inject = ['ModulesService', '$window', '$state', '$scope', 'Notification'];

  function ItemsAdminModulesController(ModulesService, $window, $state, $scope, Notification) {
    var vm = this;

    vm.modules = ModulesService.query();

    vm.remove = function(module) {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.modules.splice(vm.modules.indexOf(module), 1);
        ModulesService.rem(module);
      }
    };
  }
}());

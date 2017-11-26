(function () {
  'use strict';

  angular
    .module('items')
    .controller('ItemsListController', ItemsListController);

  ItemsListController.$inject = ['ItemsService', 'CategoriesService', 'ModulesService'];

  function ItemsListController(ItemsService, CategoriesService, ModulesService) {
    var vm = this;

    vm.items = ItemsService.query();
    vm.cats = CategoriesService.query();
    vm.mods = ModulesService.query();
    vm.increment = function(item, inc){
      item.count+=inc;
      if(item.count < 0){
        item.count = 0;
      }
      item.createOrUpdate().then(successCallback).catch(errorCallback);
    }
      function successCallback(res) {
        $state.go('items.list'); // should we send the User to the list or the updated Item's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Item save error!' });
      }
  }
}());
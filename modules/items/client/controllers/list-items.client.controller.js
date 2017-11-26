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
      var flag = false;
      for(var i=0; i<vm.items.length; i++){
        var comparator = vm.items[i];
        if(item.title == comparator.title && item.content == comparator.content && item.created == comparator.created && item.user == comparator.user && item.restockThreshold == comparator.restockThreshold && item.workingStatus == comparator.workingStatus && item.categories == comparator.categories && item.modules == comparator.modules){
        //In items array, minus some possible change to count.
         item.createOrUpdate().then(successCallback).catch(errorCallback);
         flag = true;
          break;
        }
      }
      if(!flag){
          console.log("Corrupted item not updated on backend.");
        }
    
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
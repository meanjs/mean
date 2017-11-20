(function () {
  'use strict';

  angular
    .module('items')
    .controller('ItemsAdminController', ItemsAdminController);

    ItemsAdminController.$inject = ['$scope', '$state', '$window', 'itemResolve', 'CategoriesService', 'ModulesService', 'Authentication', 'Notification'];

  function ItemsAdminController($scope, $state, $window, item, CategoriesService, ModulesService, Authentication, Notification) {
    var vm = this;
    vm.item = item;
    vm.cats = CategoriesService.query();
    vm.mods = ModulesService.query();
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Item
    function remove() {
      //console.log(vm.authentication.user.roles);
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.item.$remove(function () {
          $state.go('items.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item deleted successfully!' });
        });
      }
    }
    
    // Save Item
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itemForm');
        return false;
      }

      // Create a new item, or update the current instance
      vm.item.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('items.list'); // should we send the User to the list or the updated Item's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Item save error!' });
      }
    }
  }
}());

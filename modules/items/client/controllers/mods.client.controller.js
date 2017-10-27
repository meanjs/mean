(function () {
  'use strict';

  angular
    .module('items.mods')
    .controller('ModsController', ModsController);

  ModsController.$inject = ['$scope', '$state', '$window', 'modResolve', 'Authentication', 'Notification'];

  function ModsController($scope, $state, $window, mod, Authentication, Notification) {
    var vm = this;

    vm.item = item;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.create = create;
    vm.list = list;

   	// Remove existing Item
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.item.$remove(function () {
          $state.go('items.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item deleted successfully!' });
        });
      }
    }
    // Remove existing Item
    function create() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.item.$remove(function () {
          $state.go('items.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item deleted successfully!' });
        });
      }
    }

    // Remove existing Item
    function list() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.item.$remove(function () {
          $state.go('items.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item deleted successfully!' });
        });
      }
    }

  }
}());

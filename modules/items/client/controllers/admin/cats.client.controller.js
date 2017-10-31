(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('CatsController', CatsController);

  CatsController.$inject = ['$scope', '$state', '$window', 'catResolve', 'Authentication', 'Notification'];

  function CatsController($scope, $state, $window, cat, Authentication, Notification) {
    var vm = this;

    vm.cat = cat;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.create = create;
    vm.list = list;

    // Remove existing Item
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.cat.$remove(function () {
          $state.go('admin.items.categories');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item deleted successfully!' });
        });
      }
    }
    // Remove existing Item
    function create() {
      if ($window.confirm('Are you sure you want to create?')) {
        vm.cat.$new(function () {
          $state.go('admin.items.categories');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item created successfully!' });
        });
      }
    }

    // Remove existing Item
    function list() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.cat.$list(function () {
          $state.go('admin.items.categories');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item deleted successfully!' });
        });
      }
    }

  }
}());

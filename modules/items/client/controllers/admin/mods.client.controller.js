(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ModsController', ModsController);

  ModsController.$inject = ['$scope', '$state', '$window', 'modResolve', 'Authentication', 'Notification'];

  function ModsController($scope, $state, $window, mod, Authentication, Notification) {
    var vm = this;

    vm.mod = mod;
    vm.authentication = Authentication;
    vm.form = {};
    vm.create = create;
    vm.list = list;

    // Remove existing Item
    function create() {
      if ($window.confirm('Are you sure you want to create?')) {
        vm.mod.$new(function () {
          $state.go('admin.items.modules');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item created successfully!' });
        });
      }
    }

    // Remove existing Item
    function list() {
      
    }

  }
}());

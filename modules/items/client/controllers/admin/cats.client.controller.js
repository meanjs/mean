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
    vm.create = create;
    
    function create(valid) {
      if ($window.confirm('Are you sure you want to create?')) {
        vm.cat.$new(function () {
          $state.go('admin.items.categories');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item created successfully!' });
        });
      }
    }
  }
}());

(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminCategoriesController', ItemsAdminCategoriesController);

  ItemsAdminCategoriesController.$inject = ['ItemsService', 'CategoriesService', '$window', '$state', '$scope', 'Notification'];

  function ItemsAdminCategoriesController(ItemsService, CategoriesService, $window, $state, $scope, Notification) {
    var vm = this;

    vm.categories= CategoriesService.query();
    vm.remove= remove;
    function remove(cat) {
      if ($window.confirm('Are you sure you want to create?')) {
        cat.$rem(function () {
          $state.go('items.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item created successfully!' });
        });
      }
    }

  }
}());

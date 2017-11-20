(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminCategoriesController', ItemsAdminCategoriesController);

  ItemsAdminCategoriesController.$inject = ['CategoriesService', '$window', '$state', '$scope', 'Notification'];

  function ItemsAdminCategoriesController(CategoriesService, $window, $state, $scope, Notification) {
    var vm = this;

    vm.categories= CategoriesService.query();
    
    vm.remove = function(cat) {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.categories.splice(vm.categories.indexOf(cat), 1);
        CategoriesService.rem(cat);
      }
    }
  }
}());

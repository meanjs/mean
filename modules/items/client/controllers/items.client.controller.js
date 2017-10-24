(function () {
  'use strict';

  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', 'itemResolve', 'Authentication'];

  function ItemsController($scope, item, Authentication) {
    var vm = this;

    vm.item = item;
    vm.authentication = Authentication;

  }
}());

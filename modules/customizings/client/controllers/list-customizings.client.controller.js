(function () {
  'use strict';

  angular
    .module('customizings')
    .controller('CustomizingsListController', CustomizingsListController);

  CustomizingsListController.$inject = ['CustomizingsService'];

  function CustomizingsListController(CustomizingsService) {
    var vm = this;

    vm.customizings = CustomizingsService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('options')
    .controller('OptionsListController', OptionsListController);

  OptionsListController.$inject = ['OptionsService'];

  function OptionsListController(OptionsService) {
    var vm = this;

    vm.options = OptionsService.query();
  }
}());

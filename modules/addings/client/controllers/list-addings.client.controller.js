(function () {
  'use strict';

  angular
    .module('addings')
    .controller('AddingsListController', AddingsListController);

  AddingsListController.$inject = ['AddingsService'];

  function AddingsListController(AddingsService) {
    var vm = this;

    vm.addings = AddingsService.query();
  }
}());

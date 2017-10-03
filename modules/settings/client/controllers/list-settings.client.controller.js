(function () {
  'use strict';

  angular
    .module('settings')
    .controller('SettingsListController', SettingsListController);

  SettingsListController.$inject = ['SettingsService'];

  function SettingsListController(SettingsService) {
    var vm = this;

    vm.settings = SettingsService.query();
  }
}());

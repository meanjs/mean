(function () {
  'use strict';

  angular
    .module('sett-ings')
    .controller('SettIngsListController', SettIngsListController);

  SettIngsListController.$inject = ['SettIngsService'];

  function SettIngsListController(SettIngsService) {
    var vm = this;

    vm.settIngs = SettIngsService.query();
  }
}());

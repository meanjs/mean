(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('ProfilesListController', ProfilesListController);

  ProfilesListController.$inject = ['ProfilesService'];

  function ProfilesListController(ProfilesService) {
    var vm = this;

    vm.profiles = ProfilesService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('ProfilesListController', ProfilesListController);

  ProfilesListController.$inject = ['ProfilesService', '$scope'];

  function ProfilesListController(ProfilesService, $scope) {
    var vm = this;

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = () => {
		alert('hello');
	}

    vm.profiles = ProfilesService.query();
  }
}());

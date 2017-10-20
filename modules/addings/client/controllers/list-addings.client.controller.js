(function () {
  'use strict';

  angular
    .module('addings')
    .controller('AddingsListController', AddingsListController);

  AddingsListController.$inject = ['AddingsService', '$scope'];

  function AddingsListController(AddingsService, $scope) {
    var vm = this;

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = () => {
  		alert('hello');
  	}

    vm.addings = AddingsService.query();
  }
}());

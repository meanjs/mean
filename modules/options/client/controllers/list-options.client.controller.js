(function () {
  'use strict';

  angular
    .module('options')
    .controller('OptionsListController', OptionsListController);

  OptionsListController.$inject = ['OptionsService', '$scope'];

  function OptionsListController(OptionsService, $scope) {
    var vm = this;

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = () => {
		alert('hello');
	}

    vm.options = OptionsService.query();
  }
}());

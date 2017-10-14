(function () {
  'use strict';

  angular
    .module('customizings')
    .controller('CustomizingsListController', CustomizingsListController);

  CustomizingsListController.$inject = ['CustomizingsService', '$scope'];

  function CustomizingsListController(CustomizingsService, $scope) {
    var vm = this;

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = () => {
		alert('hello');
	}

    vm.customizings = CustomizingsService.query();
  }
}());

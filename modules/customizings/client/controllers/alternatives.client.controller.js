(function () {
  'use strict';

  angular
    .module('customizings')
    .controller('AlternativesController', AlternativesController);

  AlternativesController.$inject = ['CustomizingsService', '$scope'];

  function AlternativesController(CustomizingsService, $scope) {
    var vm = this;

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = function() {
      alert($scope.name);
    }

    vm.customizings = CustomizingsService.query();
  }
}());

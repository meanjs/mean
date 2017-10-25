(function () {
  'use strict';

  angular
    .module('customizings')
    .controller('AlternativeController', AlternativeController);

  AlternativeController.$inject = ['CustomizingsService', '$scope'];

  function AlternativeController(CustomizingsService, $scope) {
    var vm = this;

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = function() {
      alert($scope.name);
    }

    vm.customizings = CustomizingsService.query();
  }
}());

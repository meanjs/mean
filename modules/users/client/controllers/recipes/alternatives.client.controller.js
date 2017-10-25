(function () {
  'use strict';

  angular
    .module('users')
    .controller('AlternativesController', AlternativesController);

  AlternativesController.$inject = ['UsersService', '$scope'];

  function AlternativesController(UsersService, $scope) {
    var vm = this;

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = function() {
      alert($scope.name);
    }

    //vm.customizings = UserssService.query();
  }
}());

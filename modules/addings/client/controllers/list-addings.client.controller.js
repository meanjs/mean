(function () {
  'use strict';

  angular
    .module('addings')
    .controller('AddingsListController', AddingsListController);

  AddingsListController.$inject = ['AddingsService', '$scope'];

  function AddingsListController(AddingsService, $scope) {
    var vm = this;

    // TESTING
    var par = {
      'hello' : 'world'
    };

    AddingsService.testing(par)
        .then(success)
        .catch(failure);

    function success(response) {
      console.log('worked!');
      console.log(response);
    }

    function failure(response) {
      console.log('sadness')
      console.log(response);
    }
    // END TESTING

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = () => {
  		alert('hello');
  	}

    vm.addings = AddingsService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('users')
    .controller('AddRecipeController', AddRecipeController);

  AddRecipeController.$inject = ['UsersService', '$scope'];

  function AddRecipeController(UsersService, $scope) {
    var vm = this;

    // TESTING
    var param = {
      'add' : 'recipe'
    };
    // TESTING
    UsersService.adding(param)
        .then(success)
        .catch(failure);

    function success(response) {
      console.log('worked!');
      console.log(response.add);
    }

    function failure(response) {
      console.log('sadness')
      console.log(response);
    }
    // END TESTING

    //DO YOUR FRONTEND JS CODE HERE
//===========================================================================
    $scope.recipeList = [{}];

    $scope.recipeAdd = function() {
        $scope.recipeList.push({});
    };
//===========================================================================
    $scope.alert = () => {
  		alert('hello');
  	}

    //vm.addings = UsersService.query();
  }
}());

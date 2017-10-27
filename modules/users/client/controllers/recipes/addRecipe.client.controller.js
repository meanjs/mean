(function () {
  'use strict';

  angular
    .module('users')
    .controller('AddRecipeController', AddRecipeController);

  AddRecipeController.$inject = ['UsersService', '$scope', '$http'];

  function AddRecipeController(UsersService, $scope, $http) {
    var vm = this;

    var alternative = {
      'hello' : 'world'
    }

    $http.get('food_alternatives.json')
      .then( (response) => {
        console.log(response);
      });

    UsersService.usdaAlternatives(alternative)
      .then(success)
      .catch(failure)

    function success(response) {
      console.log('worked!');
      console.log(response);
    }

    function failure(response) {
      console.log('sadness')
      console.log(response);
    }

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

(function () {
  'use strict';

  angular
    .module('users')
    .controller('MyRecipesController', MyRecipesController);

  MyRecipesController.$inject = ['UsersService', '$scope'];

  function MyRecipesController(UsersService, $scope, user) {
    var vm = this;

    vm.deleteRec = deleteRec;

    UsersService.getMyRecipes()
      .then(success)
      .catch(failure)

    function deleteRec(recipe) {
       UsersService.deleteThisRecipe(recipe)
        .then(other)
        .catch(failure)
    }

    function other(response) {
      console.log("Success", response);
    }

    function success(response) {
      console.log("Recipes success: ", response.recipes);
      $scope.recipes = response.recipes;
    }

    function failure(error) {
      console.log("Failure: ", error);
    }  
  }
}());

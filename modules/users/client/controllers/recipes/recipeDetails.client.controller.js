(function () {
  'use strict';

  angular
    .module('users')
    .controller('RecipeDetailsController', RecipeDetailsController);

  RecipeDetailsController.$inject = ['UsersService', '$stateParams'];

  function RecipeDetailsController(UsersService, $stateParams) {
    var vm = this;

    console.log($stateParams.recipeDetails);

    // vm.recipedetails = UsersService.query();
  }
}());

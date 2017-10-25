(function () {
  'use strict';

  angular
    .module('users')
    .controller('RecipeDetailsController', RecipeDetailsController);

  RecipeDetailsController.$inject = ['UsersService'];

  function RecipeDetailsController(UsersService) {
    var vm = this;

    // vm.recipedetails = UsersService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('recipedetails')
    .controller('RecipedetailsListController', RecipedetailsListController);

  RecipedetailsListController.$inject = ['RecipedetailsService'];

  function RecipedetailsListController(RecipedetailsService) {
    var vm = this;

    vm.recipedetails = RecipedetailsService.query();
  }
}());

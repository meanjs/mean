(function () {
  'use strict';

  angular
    .module('recipes')
    .controller('RecipesListController', RecipesListController);

  RecipesListController.$inject = ['RecipesService'];

  function RecipesListController(RecipesService) {
    var vm = this;

    vm.recipes = RecipesService.query();
  }
}());

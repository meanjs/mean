// Recipes service used to communicate Recipes REST endpoints
(function () {
  'use strict';

  angular
    .module('recipes')
    .factory('RecipesService', RecipesService);

  RecipesService.$inject = ['$resource'];

  function RecipesService($resource) {
    return $resource('api/recipes/:recipeId', {
      recipeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

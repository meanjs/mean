// Recipedetails service used to communicate Recipedetails REST endpoints
(function () {
  'use strict';

  angular
    .module('recipedetails')
    .factory('RecipedetailsService', RecipedetailsService);

  RecipedetailsService.$inject = ['$resource'];

  function RecipedetailsService($resource) {
    return $resource('api/recipedetails/:recipedetailId', {
      recipedetailId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

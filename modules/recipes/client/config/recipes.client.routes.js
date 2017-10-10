(function () {
  'use strict';

  angular
    .module('recipes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('recipes', {
        abstract: true,
        url: '/recipes',
        template: '<ui-view/>'
      })
      .state('recipes.list', {
        url: '',
        templateUrl: 'modules/recipes/client/views/list-recipes.client.view.html',
        controller: 'RecipesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Recipes List'
        }
      })
      .state('recipes.create', {
        url: '/create',
        templateUrl: 'modules/recipes/client/views/form-recipe.client.view.html',
        controller: 'RecipesController',
        controllerAs: 'vm',
        resolve: {
          recipeResolve: newRecipe
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Recipes Create'
        }
      })
      .state('recipes.edit', {
        url: '/:recipeId/edit',
        templateUrl: 'modules/recipes/client/views/form-recipe.client.view.html',
        controller: 'RecipesController',
        controllerAs: 'vm',
        resolve: {
          recipeResolve: getRecipe
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Recipe {{ recipeResolve.name }}'
        }
      })
      .state('recipes.view', {
        url: '/:recipeId',
        templateUrl: 'modules/recipes/client/views/view-recipe.client.view.html',
        controller: 'RecipesController',
        controllerAs: 'vm',
        resolve: {
          recipeResolve: getRecipe
        },
        data: {
          pageTitle: 'Recipe {{ recipeResolve.name }}'
        }
      });
  }

  getRecipe.$inject = ['$stateParams', 'RecipesService'];

  function getRecipe($stateParams, RecipesService) {
    return RecipesService.get({
      recipeId: $stateParams.recipeId
    }).$promise;
  }

  newRecipe.$inject = ['RecipesService'];

  function newRecipe(RecipesService) {
    return new RecipesService();
  }
}());

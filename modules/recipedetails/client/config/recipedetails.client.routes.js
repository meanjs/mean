(function () {
  'use strict';

  angular
    .module('recipedetails')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('recipedetails', {
        abstract: true,
        url: '/recipedetails',
        template: '<ui-view/>'
      })
      .state('recipedetails.list', {
        url: '',
        templateUrl: 'modules/recipedetails/client/views/list-recipedetails.client.view.html',
        controller: 'RecipedetailsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Recipedetails List'
        }
      })
      .state('recipedetails.create', {
        url: '/create',
        templateUrl: 'modules/recipedetails/client/views/form-recipedetail.client.view.html',
        controller: 'RecipedetailsController',
        controllerAs: 'vm',
        resolve: {
          recipedetailResolve: newRecipedetail
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Recipedetails Create'
        }
      })
      .state('recipedetails.edit', {
        url: '/:recipedetailId/edit',
        templateUrl: 'modules/recipedetails/client/views/form-recipedetail.client.view.html',
        controller: 'RecipedetailsController',
        controllerAs: 'vm',
        resolve: {
          recipedetailResolve: getRecipedetail
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Recipedetail {{ recipedetailResolve.name }}'
        }
      })
      .state('recipedetails.view', {
        url: '/:recipedetailId',
        templateUrl: 'modules/recipedetails/client/views/view-recipedetail.client.view.html',
        controller: 'RecipedetailsController',
        controllerAs: 'vm',
        resolve: {
          recipedetailResolve: getRecipedetail
        },
        data: {
          pageTitle: 'Recipedetail {{ recipedetailResolve.name }}'
        }
      });
  }

  getRecipedetail.$inject = ['$stateParams', 'RecipedetailsService'];

  function getRecipedetail($stateParams, RecipedetailsService) {
    return RecipedetailsService.get({
      recipedetailId: $stateParams.recipedetailId
    }).$promise;
  }

  newRecipedetail.$inject = ['RecipedetailsService'];

  function newRecipedetail(RecipedetailsService) {
    return new RecipedetailsService();
  }
}());

(function () {
  'use strict';

  angular
    .module('customizings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('customizings', {
        abstract: true,
        url: '/customizings',
        template: '<ui-view/>'
      })
      .state('customizings.list', {
        url: '',
        templateUrl: 'modules/customizings/client/views/list-customizings.client.view.html',
        controller: 'CustomizingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Customizings List'
        }
      })
      .state('customizings.create', {
        url: '/create',
        templateUrl: 'modules/customizings/client/views/form-customizing.client.view.html',
        controller: 'CustomizingsController',
        controllerAs: 'vm',
        resolve: {
          customizingResolve: newCustomizing
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Customizings Create'
        }
      })
      .state('customizings.edit', {
        url: '/:customizingId/edit',
        templateUrl: 'modules/customizings/client/views/form-customizing.client.view.html',
        controller: 'CustomizingsController',
        controllerAs: 'vm',
        resolve: {
          customizingResolve: getCustomizing
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Customizing {{ customizingResolve.name }}'
        }
      })
      .state('customizings.view', {
        url: '/:customizingId',
        templateUrl: 'modules/customizings/client/views/view-customizing.client.view.html',
        controller: 'CustomizingsController',
        controllerAs: 'vm',
        resolve: {
          customizingResolve: getCustomizing
        },
        data: {
          pageTitle: 'Customizing {{ customizingResolve.name }}'
        }
      });
  }

  getCustomizing.$inject = ['$stateParams', 'CustomizingsService'];

  function getCustomizing($stateParams, CustomizingsService) {
    return CustomizingsService.get({
      customizingId: $stateParams.customizingId
    }).$promise;
  }

  newCustomizing.$inject = ['CustomizingsService'];

  function newCustomizing(CustomizingsService) {
    return new CustomizingsService();
  }
}());

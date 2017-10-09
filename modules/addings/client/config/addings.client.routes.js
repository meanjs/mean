(function () {
  'use strict';

  angular
    .module('addings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('addings', {
        abstract: true,
        url: '/addings',
        template: '<ui-view/>'
      })
      .state('addings.list', {
        url: '',
        templateUrl: 'modules/addings/client/views/list-addings.client.view.html',
        controller: 'AddingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Addings List'
        }
      })
      .state('addings.create', {
        url: '/create',
        templateUrl: 'modules/addings/client/views/form-adding.client.view.html',
        controller: 'AddingsController',
        controllerAs: 'vm',
        resolve: {
          addingResolve: newAdding
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Addings Create'
        }
      })
      .state('addings.edit', {
        url: '/:addingId/edit',
        templateUrl: 'modules/addings/client/views/form-adding.client.view.html',
        controller: 'AddingsController',
        controllerAs: 'vm',
        resolve: {
          addingResolve: getAdding
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Adding {{ addingResolve.name }}'
        }
      })
      .state('addings.view', {
        url: '/:addingId',
        templateUrl: 'modules/addings/client/views/view-adding.client.view.html',
        controller: 'AddingsController',
        controllerAs: 'vm',
        resolve: {
          addingResolve: getAdding
        },
        data: {
          pageTitle: 'Adding {{ addingResolve.name }}'
        }
      });
  }

  getAdding.$inject = ['$stateParams', 'AddingsService'];

  function getAdding($stateParams, AddingsService) {
    return AddingsService.get({
      addingId: $stateParams.addingId
    }).$promise;
  }

  newAdding.$inject = ['AddingsService'];

  function newAdding(AddingsService) {
    return new AddingsService();
  }
}());

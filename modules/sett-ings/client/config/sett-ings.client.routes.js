(function () {
  'use strict';

  angular
    .module('sett-ings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sett-ings', {
        abstract: true,
        url: '/sett-ings',
        template: '<ui-view/>'
      })
      .state('sett-ings.list', {
        url: '',
        templateUrl: 'modules/sett-ings/client/views/list-sett-ings.client.view.html',
        controller: 'SettIngsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sett ings List'
        }
      })
      .state('sett-ings.create', {
        url: '/create',
        templateUrl: 'modules/sett-ings/client/views/form-sett-ing.client.view.html',
        controller: 'SettIngsController',
        controllerAs: 'vm',
        resolve: {
          sett-ingResolve: newSettIng
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sett ings Create'
        }
      })
      .state('sett-ings.edit', {
        url: '/:settIngId/edit',
        templateUrl: 'modules/sett-ings/client/views/form-sett-ing.client.view.html',
        controller: 'SettIngsController',
        controllerAs: 'vm',
        resolve: {
          sett-ingResolve: getSettIng
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sett ing {{ sett-ingResolve.name }}'
        }
      })
      .state('sett-ings.view', {
        url: '/:settIngId',
        templateUrl: 'modules/sett-ings/client/views/view-sett-ing.client.view.html',
        controller: 'SettIngsController',
        controllerAs: 'vm',
        resolve: {
          sett-ingResolve: getSettIng
        },
        data: {
          pageTitle: 'Sett ing {{ sett-ingResolve.name }}'
        }
      });
  }

  getSettIng.$inject = ['$stateParams', 'SettIngsService'];

  function getSettIng($stateParams, SettIngsService) {
    return SettIngsService.get({
      settIngId: $stateParams.settIngId
    }).$promise;
  }

  newSettIng.$inject = ['SettIngsService'];

  function newSettIng(SettIngsService) {
    return new SettIngsService();
  }
}());

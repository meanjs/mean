(function () {
  'use strict';

  angular
    .module('options')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('options', {
        abstract: true,
        url: '/options',
        template: '<ui-view/>'
      })
      .state('options.list', {
        url: '',
        templateUrl: 'modules/options/client/views/list-options.client.view.html',
        controller: 'OptionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Options List'
        },
        css: 'modules/options/client/css/list-options.css'
      })
      .state('options.create', {
        url: '/create',
        templateUrl: 'modules/options/client/views/form-option.client.view.html',
        controller: 'OptionsController',
        controllerAs: 'vm',
        resolve: {
          optionResolve: newOption
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Options Create'
        }
      })
      .state('options.edit', {
        url: '/:optionId/edit',
        templateUrl: 'modules/options/client/views/form-option.client.view.html',
        controller: 'OptionsController',
        controllerAs: 'vm',
        resolve: {
          optionResolve: getOption
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Option {{ optionResolve.name }}'
        }
      })
      .state('options.view', {
        url: '/:optionId',
        templateUrl: 'modules/options/client/views/view-option.client.view.html',
        controller: 'OptionsController',
        controllerAs: 'vm',
        resolve: {
          optionResolve: getOption
        },
        data: {
          pageTitle: 'Option {{ optionResolve.name }}'
        }
      });
  }

  getOption.$inject = ['$stateParams', 'OptionsService'];

  function getOption($stateParams, OptionsService) {
    return OptionsService.get({
      optionId: $stateParams.optionId
    }).$promise;
  }

  newOption.$inject = ['OptionsService'];

  function newOption(OptionsService) {
    return new OptionsService();
  }
}());

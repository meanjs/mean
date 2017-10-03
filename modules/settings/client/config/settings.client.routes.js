(function () {
  'use strict';

  angular
    .module('settings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        template: '<ui-view/>'
      })
      .state('settings.list', {
        url: '',
        templateUrl: 'modules/settings/client/views/list-settings.client.view.html',
        controller: 'SettingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings List'
        }
      })
      .state('settings.create', {
        url: '/create',
        templateUrl: 'modules/settings/client/views/form-setting.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        resolve: {
          settingResolve: newSetting
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Settings Create'
        }
      })
      .state('settings.edit', {
        url: '/:settingId/edit',
        templateUrl: 'modules/settings/client/views/form-setting.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        resolve: {
          settingResolve: getSetting
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Setting {{ settingResolve.name }}'
        }
      })
      .state('settings.view', {
        url: '/:settingId',
        templateUrl: 'modules/settings/client/views/view-setting.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        resolve: {
          settingResolve: getSetting
        },
        data: {
          pageTitle: 'Setting {{ settingResolve.name }}'
        }
      });
  }

  getSetting.$inject = ['$stateParams', 'SettingsService'];

  function getSetting($stateParams, SettingsService) {
    return SettingsService.get({
      settingId: $stateParams.settingId
    }).$promise;
  }

  newSetting.$inject = ['SettingsService'];

  function newSetting(SettingsService) {
    return new SettingsService();
  }
}());

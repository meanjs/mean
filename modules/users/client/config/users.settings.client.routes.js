(function () {
  'use strict';

  angular
    .module('users')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('settings', {
        abstract: true,
        data: {
          roles: ['user', 'admin']
        },
        url: '/settings',
        views: {
          'main@': {
            templateUrl: 'modules/core/client/views/layouts/two.column.container.client.view.html'
          }
        }
      })
      .state('settings.profile', {
        url: '/profile',
        views: {
          'col-1-row-1': {
            templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
            controller: 'SettingsController'
          },
          'col-2-row-1': {
            templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html',
            controller: 'EditProfileController'
          }
        }
      })
      .state('settings.password', {
        url: '/password',
        views: {
          'col-1-row-1': {
            templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
            controller: 'SettingsController'
          },
          'col-2-row-1': {
            templateUrl: 'modules/users/client/views/settings/change-password.client.view.html',
            controller: 'ChangePasswordController'
          }
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        views: {
          'col-1-row-1': {
            templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
            controller: 'SettingsController'
          },
          'col-2-row-1': {
            templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html',
            controller: 'SocialAccountsController'
          }
        }
      })
      .state('settings.picture', {
        url: '/picture',
        views: {
          'col-1-row-1': {
            templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
            controller: 'SettingsController'
          },
          'col-2-row-1': {
            templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html',
            controller: 'ChangeProfilePictureController'
          }
        }
      });
  }
})();

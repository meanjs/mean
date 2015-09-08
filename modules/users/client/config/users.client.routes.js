'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'settings',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'edit-profile'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'change-password'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'manage-social-accounts'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'change-profile-picture'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'authentication'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'signup'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'signin'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'forgot-password'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'reset-password-invalid'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'reset-password-success'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'reset-password'
      });
  }
]);

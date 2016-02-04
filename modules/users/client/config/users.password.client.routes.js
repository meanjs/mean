(function () {
  'use strict';

  angular
    .module('users')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {

    $stateProvider
      .state('password', {
        abstract: true,
        url: '/password'
      })
      .state('password.forgot', {
        url: '/forgot',
        views: {
          'main@': {
            templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html',
            controller: 'PasswordController'
          }
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        views: {
          'main@': {
            templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
          }
        }
      })
      .state('password.reset.success', {
        url: '/success',
        views: {
          'main@': {
            templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
          }
        }
      })
      .state('password.reset.form', {
        url: '/:token',
        views: {
          'main@': {
            templateUrl: 'modules/users/client/views/password/reset-password.client.view.html',
            controller: 'PasswordController'
          }
        }
      });
  }
})();

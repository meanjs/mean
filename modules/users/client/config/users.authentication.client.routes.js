(function () {
  'use strict';

  angular
    .module('users')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        views: {
          'main@': {
            templateUrl: 'modules/core/client/views/layouts/fixed.one.column.client.view.html',
            controller: 'AuthenticationController'
          }
        }
      })
      .state('authentication.signup', {
        url: '/signup',
        views: {
          'row-1': {
            templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
          },
          'row-2': {
            templateUrl: 'modules/users/client/views/authentication/signup.client.view.html',
          }
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        views: {
          'row-1': {
            templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
          },
          'row-2': {
            templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
          }
        }
      });
  }
})();

(function () {
  'use strict';

  angular
    .module('core')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      views: {
        'hero': {
          templateUrl: 'modules/core/client/views/hero.client.view.html'
        },
        'main': {
          controller: 'HomeController',
          templateUrl: 'modules/core/client/views/home.client.view.html'
        },
        'subnav': {
          templateUrl: 'modules/core/client/views/subnav.client.view.html'
        }
      }

    })
    .state('not-found', {
      url: '/not-found',
      data: {
        ignoreState: true
      },
      views: {
        'main': {
          templateUrl: 'modules/core/client/views/404.client.view.html'
        }
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      data: {
        ignoreState: true
      },
      views: {
        'main': {
          templateUrl: 'modules/core/client/views/400.client.view.html'
        }
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      data: {
        ignoreState: true
      },
      views: {
        'main': {
          templateUrl: 'modules/core/client/views/403.client.view.html'
        }
      }
    });
  }
})();

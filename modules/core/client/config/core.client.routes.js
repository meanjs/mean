'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

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
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('home.orgDash', {
      url: '/orgDashboard',
      templateUrl: 'modules/core/client/views/orgDash.client.view.html'
    })
    .state('home.orgDash.eventList', {
      url: '/',
      templateUrl: 'modules/core/client/views/orgDash.eventList.client.view.html'
    })
    .state('home.orgDash.calendar', {
      url: '/',
      templateUrl: 'modules/core/client/views/orgDash.calendar.client.view.html'
    })
    .state('home.orgDash.pastEvents', {
      url: '/',
      templateUrl: 'modules/core/client/views/orgDash.pastEvents.client.view.html'
    })
    .state('home.requestEvent', {
      url: '/requestEvent',
      templateUrl: 'modules/core/client/views/orgDash.requestEvent.client.view.html'
    })
    .state('home.bizDash', {
      url: '/bizDashboard',
      templateUrl: 'modules/core/client/views/bizDash.client.view.html'
    })
    .state('home.bizDash.eventList', {
      url: '/',
      templateUrl: 'modules/core/client/views/bizDash.eventList.client.view.html'
    })
    .state('home.bizDash.calendar', {
      url: '/',
      templateUrl: 'modules/core/client/views/bizDash.calendar.client.view.html'
    })
    .state('home.bizDash.pastEvents', {
      url: '/',
      templateUrl: 'modules/core/client/views/bizDash.pastEvents.client.view.html'
    })
    .state('home.createEvent', {
      url: '/createEvent',
      templateUrl: 'modules/core/client/views/bizDash.createEvent.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

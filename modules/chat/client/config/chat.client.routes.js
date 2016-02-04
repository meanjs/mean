(function () {
  'use strict';

  angular
    .module('chat.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        data: {
          roles: ['user', 'admin']
        },
        views: {
          'main': {
            templateUrl: 'modules/chat/client/views/chat.client.view.html',
            controller: 'ChatController',
            controllerAs: 'vm',
          }
        }
      });
  }
})();

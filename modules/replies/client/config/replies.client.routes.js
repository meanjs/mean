'use strict';

// Setting up route
angular.module('replies').config(['$stateProvider',
  function ($stateProvider) {
    // Replies state routing
    // $stateProvider
    //   .state('replies', {
    //     abstract: true,
    //     url: '/replies',
    //     template: '<ui-view/>'
    //   })
    //   .state('replies.list', {
    //     url: '',
    //     templateUrl: 'modules/replies/client/views/list-replies.client.view.html'
    //   })
    //   .state('replies.create', {
    //     url: '/create',
    //     templateUrl: 'modules/replies/client/views/create-reply.client.view.html',
    //     data: {
    //       roles: ['user', 'admin']
    //     }
    //   })
    //   .state('replies.view', {
    //     url: '/:replyId',
    //     templateUrl: 'modules/replies/client/views/view-reply.client.view.html'
    //   })
    //   .state('replies.edit', {
    //     url: '/:replyId/edit',
    //     templateUrl: 'modules/replies/client/views/edit-reply.client.view.html',
    //     data: {
    //       roles: ['user', 'admin']
    //     }
    //   });
  }
]);

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'list-articles'
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'create-article',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'view-article'
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'edit-article',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>',
        controller: 'ArticlesController'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/views/list-articles.client.view.html',
        controller: 'ArticlesListController'
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/views/create-article.client.view.html',
        controller: 'ArticlesCreateController',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/views/view-article.client.view.html',
        controller: 'ArticlesViewController'
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/views/edit-article.client.view.html',
        controller: 'ArticlesEditController',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

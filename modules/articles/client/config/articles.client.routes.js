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
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html',
        controller: 'ArticlesListController',
        resolve:{
          articles: function (Articles, $stateParams, $state) {
            return Articles.query().$promise.then(
              function (articles) {
                //success
                return articles;
              },
              function () {
                //fail
                $state.go('not-found');
              }
            );
          }
        }
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/create-article.client.view.html',
        controller: 'ArticlesController',
        data: {
          roles: ['user', 'admin']
        },
        resolve: {
          article: function () {
            return { mock: 'mock' };
          }
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html',
        controller: 'ArticlesController',
        resolve: {
          article: function (Articles, $stateParams, $state) {
            return Articles.get({
              articleId: $stateParams.articleId
            }).$promise.then(
              function (article) {
                //success
                return article;
              },
              function () {
                //fail
                $state.go('not-found');
              }
            );
          }
        }
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
        controller: 'ArticlesController',
        resolve: {
          article: function (Articles, $stateParams, $state) {
            return Articles.get({
              articleId: $stateParams.articleId
            }).$promise.then(
              function (article) {
                //Auth Check
                if (article === undefined || typeof article !== 'object' || article._id === undefined) {
                  $state.go('unauthorized');
                }
                return article;
              },
              function () {
                //fail
                $state.go('not-found');
              }
            );
          }
        },
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

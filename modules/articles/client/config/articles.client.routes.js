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
        controller: 'ArticlesListController'
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
            return { };
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
            }).$promise;
          }
        }
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
        controller: 'ArticlesController',
        resolve: {
          article: function (Articles, Authentication, $stateParams, $state) {
            return Articles.get({
              articleId: $stateParams.articleId
            }).$promise.then(function (article) {
                //Auth Check
                if (article.user._id !== Authentication.user._id && Authentication.user.roles.indexOf('admin') === -1) {
                  //TODO  Change to unauthorized when that PR is merged
                  $state.go('unauthorized');
                }
                return article;
              });
          }
        },
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

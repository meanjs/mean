(function () {
  'use strict';

  angular
    .module('articles.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles'
      })
      .state('articles.list', {
        url: '',
        views: {
          'main@': {
            templateUrl: 'modules/articles/client/views/list-articles.client.view.html',
            controller: 'ArticlesListController',
            controllerAs: 'vm'
          }
        }
      })
      .state('articles.create', {
        url: '/create',
        resolve: {
          articleResolve: newArticle
        },
        data: {
          roles: ['user', 'admin']
        },
        views: {
          'main@': {
            templateUrl: 'modules/articles/client/views/form-article.client.view.html',
            controller: 'ArticlesController',
            controllerAs: 'vm'
          }
        }
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        resolve: {
          articleResolve: getArticle
        },
        data: {
          roles: ['user', 'admin']
        },
        views: {
          'main@': {
            templateUrl: 'modules/articles/client/views/form-article.client.view.html',
            controller: 'ArticlesController',
            controllerAs: 'vm',
          }
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        resolve: {
          articleResolve: getArticle
        },
        views: {
          'main@': {
            templateUrl: 'modules/articles/client/views/view-article.client.view.html',
            controller: 'ArticlesController',
            controllerAs: 'vm'
          }
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'ArticlesService'];

  function getArticle($stateParams, ArticlesService) {
    return ArticlesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticle.$inject = ['ArticlesService'];

  function newArticle(ArticlesService) {
    return new ArticlesService();
  }
})();

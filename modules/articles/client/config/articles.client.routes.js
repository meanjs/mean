/**
 * Articles Route Config
 */

(function () {
	'use strict';

	angular
		.module('articles.routes')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		// Articles state routing
		$stateProvider
			.state('articles', {
				abstract: true,
				url: '/articles',
				template: '<ui-view/>'
			})
			.state('articles.list', {
				url: '',
				templateUrl: 'modules/articles/views/list-articles.client.view.html',
				controller: 'ArticleListController',
				controllerAs: 'vm',
				resolve: {
					articlesResolve: listArticles
				}
			})
			.state('articles.create', {
				url: '/create',
				templateUrl: 'modules/articles/views/create-article.client.view.html',
				controller: 'ArticlesController',
				controllerAs: 'vm',
				resolve: {
					articleResolve: newArticle
				}
			})
			.state('articles.view', {
				url: '/:articleId',
				templateUrl: 'modules/articles/views/view-article.client.view.html',
				controller: 'ArticlesController',
				controllerAs: 'vm',
				resolve: {
					articleResolve: findArticle
				}
			})
			.state('articles.edit', {
				url: '/:articleId/edit',
				templateUrl: 'modules/articles/views/edit-article.client.view.html',
				controller: 'ArticlesController',
				controllerAs: 'vm',
				resolve: {
					articleResolve: findArticle
				}
			});
	}

	listArticles.$inject = ['Articles'];

	function listArticles(Articles) {
		return Articles.query();
	}

	findArticle.$inject = ['$stateParams', 'Articles'];

	function findArticle($stateParams, Articles) {
		return Articles.get({
			articleId: $stateParams.articleId
		});
	}

	newArticle.$inject = ['Articles'];

	function newArticle(Articles) {
		return new Articles();
	}
})();

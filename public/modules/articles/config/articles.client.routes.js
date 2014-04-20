'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit.client.view.html'
		});
	}
]);
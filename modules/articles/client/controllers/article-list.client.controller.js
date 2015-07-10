/**
 * Articles Controller
 */

(function () {
	'use strict';

	angular
		.module('articles')
		.controller('ArticleListController', ArticleListController);

	ArticleListController.$inject = ['Authentication', 'articlesResolve'];

	function ArticleListController(Authentication, articlesResolve) {
		var vm = this;
		vm.authentication = Authentication;
		vm.articles = articlesResolve;
	}
})();

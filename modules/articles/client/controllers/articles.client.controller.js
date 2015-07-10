/**
 * Articles Controller
 */

(function () {
	'use strict';

	angular
		.module('articles')
		.controller('ArticlesController', ArticlesController);

	ArticlesController.$inject = ['$state', 'Authentication', 'articleResolve'];

	function ArticlesController($state, Authentication, articleResolve) {
		var vm = this;
		vm.authentication = Authentication;
		vm.article = articleResolve;
		vm.save = save;
		vm.remove = remove;

		// Save Article
		function save() {
			var article = vm.article;

			if (article._id)
			{
				article.$update(successCallback, errorCallback);
			} else {
				article.$save(successCallback, errorCallback);
			}

			function successCallback(response) {
				$state.go('articles.view', {
					articleId: response._id
				}, {
					reload: true
				});
			}

			function errorCallback(errorResponse) {
				vm.error = errorResponse.data.message;
			}
		}

		// Remove existing Article
		function remove() {
			vm.article.$remove(function () {
				$state.go('articles.list');
			});
		}
	}
})();

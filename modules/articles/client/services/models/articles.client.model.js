/**
 * Articles Model
 */

(function () {
	'use strict';

	angular
		.module('articles.models')
		.factory('Articles', Articles);

	Articles.$inject = ['$resource'];

	function Articles($resource) {
		return $resource('api/articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
})();

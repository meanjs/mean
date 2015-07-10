/**
 * Articles Menus Config
 */

(function () {
	'use strict';

	angular
		.module('articles.menus')
		.run(menuConfig);

	menuConfig.$inject = ['Menus'];

	function menuConfig(Menus) {
		// Add the articles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Articles',
			state: 'articles',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'articles', {
			title: 'List Articles',
			state: 'articles.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'articles', {
			title: 'Create Articles',
			state: 'articles.create'
		});
	}
})();

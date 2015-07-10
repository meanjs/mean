(function (app) {
	'use strict';

	// Use Applicaion configuration module to register a new module
	app.registerModule('articles');
	// TODO this should be core.menus once core is refactored.
	app.registerModule('articles.menus', ['core']);
	app.registerModule('articles.models');
	app.registerModule('articles.routes', ['ui.router', 'articles.models']);
})(ApplicationConfiguration);

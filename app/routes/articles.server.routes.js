'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	articles = require('../../app/controllers/articles.server.controller');

module.exports = function(app) {
	/**
	 * Module dependencies.
	 */
	var users = require('../../app/controllers/users'),
		articles = require('../../app/controllers/articles');

	// Article Routes
	app.route('/api/articles')
		.get(articles.list)
		.post(users.requiresLogin, articles.create);

	app.route('/api/articles/:articleId')
		.get(articles.read)
		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

	// Finish by binding the article middleware
	app.param('articleId', articles.articleByID);
};

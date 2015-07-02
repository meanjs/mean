'use strict';

/**
 * Module dependencies.
 */
var adminPolicy = require('../policies/admin.server.policy'),
	admin = require('../controllers/admin.server.controller');

module.exports = function(app) {
	// Articles collection routes
	app.route('/api/admin').all(adminPolicy.isAllowed)
		.get(admin.list);
		//.post(articles.create);

	// Single article routes
	app.route('/api/admin/:userId').all(adminPolicy.isAllowed)
		.get(admin.read)
		.put(admin.update)
		.delete(admin.delete);

	// Finish by binding the article middleware
	app.param('userId', admin.userByID);
};

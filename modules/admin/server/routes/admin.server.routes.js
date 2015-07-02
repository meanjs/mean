'use strict';

/**
 * Module dependencies.
 */
var adminPolicy = require('../policies/admin.server.policy'),
	admin = require('../controllers/admin.server.controller');

module.exports = function (app) {
	// Users collection routes
	app.route('/api/users').all(adminPolicy.isAllowed)
		.get(admin.list);

	// Single user routes
	app.route('/api/users/:userId').all(adminPolicy.isAllowed)
		.get(admin.read)
		.put(admin.update)
		.delete(admin.delete);

	// Finish by binding the user middleware
	app.param('userId', admin.userByID);
};

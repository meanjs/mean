'use strict';

module.exports = function(app) {
	/**
	 * Module dependencies.
	 */
	var core = require('../../app/controllers/core.server.controller');

	// Core Routes
	app.route('/').get(core.index);
};

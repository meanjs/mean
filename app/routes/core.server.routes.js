'use strict';

module.exports = function(app) {
	/**
	 * Module dependencies.
	 */
	var core = require('../../app/controllers/core');

	// Core Routes
	app.route('*').get(core.index);
};

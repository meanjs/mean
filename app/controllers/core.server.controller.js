'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index.server.view.html', {
		user: req.user || null
	});
};
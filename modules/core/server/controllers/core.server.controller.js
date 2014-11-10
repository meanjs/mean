'use strict';

/**
 * Render the main applicaion page
 */
exports.renderIndex = function(req, res) {
	res.render('modules/core/server/views/index', {
		user: req.user || null
	});
};

/**
 * Render the server error page
 */
exports.renderServerError = function(req, res) {
	res.status(500).render('modules/core/server/views/500', {
		error: 'Oops! Something went wrong...'
	});
};

/**
 * Render the server not found page
 */
exports.renderNotFound = function(req, res) {
	res.status(404).render('modules/core/server/views/404', {
		url: req.originalUrl
	});
};

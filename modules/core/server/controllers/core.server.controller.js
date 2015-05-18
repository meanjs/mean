'use strict';

/**
 * Render the main application page
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
 * Render the server not found responses
 */
exports.renderNotFound = function(req, res) {
	res.status(404);

	// Respond with html page
	if (req.accepts('html')) {
		res.render('modules/core/server/views/404', {
			url: req.originalUrl
		});
		return;
	}

	// Respond with json to API calls
	if (req.accepts('json')) {
		res.json({ error: 'Path not found' });
		return;
	}

	// Default to plain-text
	res.type('txt').send('Path not found');
};

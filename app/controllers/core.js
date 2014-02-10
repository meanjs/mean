'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
    res.render('index.html', {
		user: req.user || null
    });
};

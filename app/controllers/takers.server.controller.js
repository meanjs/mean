'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Taker = mongoose.model('Taker'),
	_ = require('lodash');

/**
 * Create a Taker
 */
exports.create = function(req, res) {
	var taker = new Taker(req.body);
	taker.user = req.user;

	taker.save(function(err) {
		if (err) {
			return res.send('users/signup', {
				errors: err.errors,
				taker:taker
			});
		} else {
			res.jsonp(taker);
		}
	});
};

/**
 * Show the current qa
 */
exports.read = function(req, res) {
	res.jsonp(req.taker);
};

/**
 * Update a qa
 */
exports.update = function(req, res) {
	var taker = req.taker;
console.log('from node', taker);
	taker = _.extend(taker, req.body);

	taker.save(function(err) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.jsonp(taker);
		}
	});
};

/**
 * Delete an qa
 */
exports.delete = function(req, res) {
	var taker = req.taker;

	taker.remove(function(err) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.jsonp(taker);
		}
	});
};

/**
 * List of QAs
 */
exports.list = function(req, res) {
	Taker.find().sort('-created').populate('user', 'displayName').exec(function(err, takers) {
		if (err) {
			res.render('error', {
				status: 500
			});
		} else {
			res.jsonp(takers);
		}
	});
};

/**
 * Taker middleware
 */
exports.TakerByID = function(req, res, next, id) {
	Taker.load(id, function(err, taker) {
		if (err) return next(err);
		if (!taker) return next(new Error('Failed to load qa ' + id));
		req.taker = taker;
		next();
	});
};

/**
 * QA authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.qa.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Taker = mongoose.model('Taker'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Taker already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Taker
 */
exports.create = function(req, res) {
	var taker = new Taker(req.body);
	taker.user = req.user;

	taker.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(taker);
		}
	});
};

/**
 * Show the current Taker
 */
exports.read = function(req, res) {
	res.jsonp(req.taker);
};

/**
 * Update a Taker
 */
exports.update = function(req, res) {
	var taker = req.taker ;

	taker = _.extend(taker , req.body);

	taker.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(taker);
		}
	});
};

/**
 * Delete an Taker
 */
exports.delete = function(req, res) {
	var taker = req.taker ;

	taker.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(taker);
		}
	});
};

/**
 * List of Takers
 */
exports.list = function(req, res) { Taker.find().sort('-created').populate('user', 'displayName').exec(function(err, takers) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(takers);
		}
	});
};

/**
 * Taker middleware
 */
exports.takerByID = function(req, res, next, id) { Taker.findById(id).populate('user', 'displayName').exec(function(err, taker) {
		if (err) return next(err);
		if (! taker) return next(new Error('Failed to load Taker ' + id));
		req.taker = taker ;
		next();
	});
};

/**
 * Taker authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.taker.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
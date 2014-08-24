'use strict';

/**
 * Module dependencies...
 */
var mongoose = require('mongoose'),
	Qa = mongoose.model('Qa'),
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
				message = 'Qa already exists';
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
 * Create a Qa
 */
exports.create = function(req, res) {
	var qa = new Qa(req.body);
	qa.user = req.user;

	qa.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(qa);
		}
	});
};

/**
 * *
 * Show the current Qa
 */
exports.read = function(req, res) {
	res.jsonp(req.qa);
};

/**
 * Update a Qa
 */
exports.update = function(req, res) {
	var qa = req.qa ;

	qa = _.extend(qa , req.body);

	qa.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(qa);
		}
	});
};

/**
 * Delete an Qa
 */
exports.delete = function(req, res) {
	var qa = req.qa ;

	qa.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(qa);
		}
	});
};

/**
 * List of Qas
 */
exports.list = function(req, res) { Qa.find().sort('-created').populate('user', 'displayName').exec(function(err, qas) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(qas);
		}
	});
};

/**
 * Qa middleware
 */
exports.qaByID = function(req, res, next, id) { Qa.findById(id).populate('user', 'displayName').exec(function(err, qa) {
		if (err) return next(err);
		if (! qa) return next(new Error('Failed to load Qa ' + id));
		req.qa = qa ;
		next();
	});
};

/**
 * Qa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.qa.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
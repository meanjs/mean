'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Timesheet = mongoose.model('Timesheet'),
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
				message = 'Timesheet already exists';
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
 * Create a Timesheet
 */
exports.create = function(req, res) {
	var timesheet = new Timesheet(req.body);
	timesheet.user = req.user;

	timesheet.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(timesheet);
		}
	});
};

/**
 * Show the current Timesheet
 */
exports.read = function(req, res) {
	res.jsonp(req.timesheet);
};

/**
 * Update a Timesheet
 */
exports.update = function(req, res) {
	var timesheet = req.timesheet ;

	timesheet = _.extend(timesheet , req.body);

	timesheet.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(timesheet);
		}
	});
};

/**
 * Delete an Timesheet
 */
exports.delete = function(req, res) {
	var timesheet = req.timesheet ;

	timesheet.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(timesheet);
		}
	});
};

/**
 * List of Timesheets
 */
exports.list = function(req, res) { Timesheet.find().sort('-created').populate('user', 'displayName').exec(function(err, timesheets) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(timesheets);
		}
	});
};

/**
 * Timesheet middleware
 */
exports.timesheetByID = function(req, res, next, id) { Timesheet.findById(id).populate('user', 'displayName').exec(function(err, timesheet) {
		if (err) return next(err);
		if (! timesheet) return next(new Error('Failed to load Timesheet ' + id));
		req.timesheet = timesheet ;
		next();
	});
};

/**
 * Timesheet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.timesheet.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
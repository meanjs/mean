'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Vendor = mongoose.model('Vendor'),
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
				message = 'Vendor already exists';
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
 * Create a Vendor
 */
exports.create = function(req, res) {
	var vendor = new Vendor(req.body);
	vendor.user = req.user;

	vendor.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(vendor);
		}
	});
};

/**
 * Show the current Vendor
 */
exports.read = function(req, res) {
	res.jsonp(req.vendor);
};

/**
 * Update a Vendor
 */
exports.update = function(req, res) {
	var vendor = req.vendor ;

	vendor = _.extend(vendor , req.body);

	vendor.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(vendor);
		}
	});
};

/**
 * Delete an Vendor
 */
exports.delete = function(req, res) {
	var vendor = req.vendor ;

	vendor.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(vendor);
		}
	});
};

/**
 * List of Vendors
 */
exports.list = function(req, res) { Vendor.find().sort('-created').populate('user', 'displayName').exec(function(err, vendors) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(vendors);
		}
	});
};

/**
 * Vendor middleware
 */
exports.vendorByID = function(req, res, next, id) { Vendor.findById(id).populate('user', 'displayName').exec(function(err, vendor) {
		if (err) return next(err);
		if (! vendor) return next(new Error('Failed to load Vendor ' + id));
		req.vendor = vendor ;
		next();
	});
};

/**
 * Vendor authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.vendor.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
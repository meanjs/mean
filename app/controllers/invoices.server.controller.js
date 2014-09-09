'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Invoice = mongoose.model('Invoice'),
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
				message = 'Invoice already exists';
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
 * Create a Invoice
 */
exports.create = function(req, res) {
	var invoice = new Invoice(req.body);
	invoice.user = req.user;

	invoice.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(invoice);
		}
	});
};

/**
 * Show the current Invoice
 */
exports.read = function(req, res) {
	res.jsonp(req.invoice);
};

/**
 * Update a Invoice
 */
exports.update = function(req, res) {
	var invoice = req.invoice ;

	invoice = _.extend(invoice , req.body);

	invoice.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(invoice);
		}
	});
};

/**
 * Delete an Invoice
 */
exports.delete = function(req, res) {
	var invoice = req.invoice ;

	invoice.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(invoice);
		}
	});
};

/**
 * List of Invoices
 */
exports.list = function(req, res) { Invoice.find().sort('-created').populate('user', 'displayName').exec(function(err, invoices) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(invoices);
		}
	});
};

/**
 * Invoice middleware
 */
exports.invoiceByID = function(req, res, next, id) { Invoice.findById(id).populate('user', 'displayName').exec(function(err, invoice) {
		if (err) return next(err);
		if (! invoice) return next(new Error('Failed to load Invoice ' + id));
		req.invoice = invoice ;
		next();
	});
};

/**
 * Invoice authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.invoice.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Expense = mongoose.model('Expense'),
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
				message = 'Expense already exists';
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
 * Create a Expense
 */
exports.create = function(req, res) {
	var expense = new Expense(req.body);
	expense.user = req.user;

	expense.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(expense);
		}
	});
};

/**
 * Show the current Expense
 */
exports.read = function(req, res) {
	res.jsonp(req.expense);
};

/**
 * Update a Expense
 */
exports.update = function(req, res) {
	var expense = req.expense ;

	expense = _.extend(expense , req.body);

	expense.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(expense);
		}
	});
};

/**
 * Delete an Expense
 */
exports.delete = function(req, res) {
	var expense = req.expense ;

	expense.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(expense);
		}
	});
};

/**
 * List of Expenses
 */
exports.list = function(req, res) { Expense.find().sort('-created').populate('user', 'displayName').exec(function(err, expenses) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(expenses);
		}
	});
};

/**
 * Expense middleware
 */
exports.expenseByID = function(req, res, next, id) { Expense.findById(id).populate('user', 'displayName').exec(function(err, expense) {
		if (err) return next(err);
		if (! expense) return next(new Error('Failed to load Expense ' + id));
		req.expense = expense ;
		next();
	});
};

/**
 * Expense authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.expense.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
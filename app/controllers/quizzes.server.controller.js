'use strict';

/**
 * Module dependencies...
 */
var mongoose = require('mongoose'),
	Quiz = mongoose.model('Quiz'),
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
				message = 'Quiz already exists';
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
 * Create a Quiz
 */
exports.create = function(req, res) {
	var quiz = new Quiz(req.body);
	quiz.user = req.user;

	quiz.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(quiz);
		}
	});
};

/**
 * *
 * Show the current Quiz
 */
exports.read = function(req, res) {
	res.jsonp(req.quiz);
};

/**
 * Update a Quiz
 */
exports.update = function(req, res) {
	var quiz = req.quiz ;

	quiz = _.extend(quiz , req.body);

	quiz.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(quiz);
		}
	});
};

/**
 * Delete an Quiz
 */
exports.delete = function(req, res) {
	var quiz = req.quiz ;

	quiz.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(quiz);
		}
	});
};

/**
 * List of quizzes
 */
exports.list = function(req, res) { Quiz.find().sort('-created').populate('user', 'displayName').exec(function(err, quizzes) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(quizzes);
		}
	});
};

/**
 * Quiz middleware
 */
exports.quizByID = function(req, res, next, id) { Quiz.findById(id).populate('user', 'displayName').exec(function(err, quiz) {
		if (err) return next(err);
		if (! quiz) return next(new Error('Failed to load Quiz ' + id));
		req.quiz = quiz ;
		next();
	});
};

/**
 * Quiz authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.quiz.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

/**
 * Record User's vote and update Article vote counts
 */
exports.vote = function(req, res) {
	var article = req.article;
	var user = req.user;
	var newVoteDirection = req.params.direction;
	var oldVoteDirection;
	var upVotesAddend = 0;
	var downVotesAddend = 0;
	var voteIndex;

	// look for existing vote
	for (voteIndex = 0; voteIndex < user.votes.length; voteIndex++) {
		if (article._id.toString() === user.votes[voteIndex]._id.toString()) {
			break;
		}
	}

	// if no vote exists, add one
	if (voteIndex === user.votes.length) {
		user.votes.push({
			_id: article._id,
			direction:'none'
		});
	}

	oldVoteDirection = user.votes[voteIndex].direction;
	user.votes[voteIndex].direction = newVoteDirection;
	if (oldVoteDirection === 'none') {
		upVotesAddend = newVoteDirection === 'up' ? 1 : 0;
		downVotesAddend = newVoteDirection === 'down' ? 1 : 0;
	} else if (newVoteDirection === 'none') {
		upVotesAddend = oldVoteDirection === 'up' ? -1 : 0;
		downVotesAddend = oldVoteDirection === 'down' ? -1 : 0;
	} else if (oldVoteDirection !== newVoteDirection) {
		upVotesAddend = newVoteDirection === 'up' ? 1 : -1;
		downVotesAddend = upVotesAddend * -1;
	}

	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			article.update({ $inc: { upVotes: upVotesAddend, downVotes: downVotesAddend }}, {}, function(err) {
				if (err) {
					return res.status(500).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.json({
						oldVoteDirection: oldVoteDirection,
						newVoteDirection: newVoteDirection
					});
				}
			});
		}
	});

};

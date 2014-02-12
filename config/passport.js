'use strict';

var passport = require('passport'),
	User = require('mongoose').model('User'),
	path = require('path'),
	utilities = require('./utilities');

module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -hashed_password', function(err, user) {
			done(err, user);
		});
	});

	// Initialize strategies
	utilities.walk('./config/strategies', /(.*)\.(js$|coffee$)/).forEach(function(strategyPath) {
		require(path.resolve(strategyPath))();
	});
};
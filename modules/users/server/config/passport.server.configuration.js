'use strict';

var passport = require('passport'),
	User = require('mongoose').model('User'),
	path = require('path');

module.exports = function(app, config) {
	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});

	// Initialize strategies
	config.getGlobbedFiles(path.join(__dirname, 'strategies/*.js')).forEach(function(strategy) {
		require(path.resolve(strategy))(config);
	});
};
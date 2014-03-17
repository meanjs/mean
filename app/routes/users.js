'use strict';

var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users');
	app.get('/users/me', users.me);

	// Setting up the users api
	app.post('/auth/signup', users.signup);
	app.post('/auth/signin', users.signin);
	app.get('/auth/signout', users.signout);

	// Setting the facebook oauth routes
	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope: ['email'],
		failureRedirect: '/#!/signin'
	}), users.signin);
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/#!/signin'
	}), users.authCallback);

	// Setting the twitter oauth routes
	app.get('/auth/twitter', passport.authenticate('twitter', {
		failureRedirect: '/#!/signin'
	}), users.signin);
	app.get('/auth/twitter/callback', passport.authenticate('twitter', {
		failureRedirect: '/#!/signin'
	}), users.authCallback);

	// Setting the google oauth routes
	app.get('/auth/google', passport.authenticate('google', {
		failureRedirect: '/#!/signin',
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}), users.signin);
	app.get('/auth/google/callback', passport.authenticate('google', {
		failureRedirect: '/#!/signin'
	}), users.authCallback);

	// Setting the linkedin oauth routes
	app.get('/auth/linkedin', passport.authenticate('linkedin', {
		failureRedirect: '/#!/signin'
	}), users.signin);
	app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
		failureRedirect: '/#!/signin'
	}), users.authCallback);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};

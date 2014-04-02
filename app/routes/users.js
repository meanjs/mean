'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users');
	app.get('/users/me', users.me);
	app.put('/users', users.update);
	app.post('/users/password', users.changePassword);

	// Setting up the users api
	app.post('/auth/signup', users.signup);
	app.post('/auth/signin', users.signin);
	app.get('/auth/signout', users.signout);

	// Setting the facebook oauth routes
	app.get('/auth/facebook', passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.get('/auth/facebook/callback', users.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.get('/auth/twitter', passport.authenticate('twitter'));
	app.get('/auth/twitter/callback',  users.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.get('/auth/google', passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.get('/auth/google/callback', users.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.get('/auth/linkedin', passport.authenticate('linkedin'));
	app.get('/auth/linkedin/callback', users.oauthCallback('linkedin'));

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};

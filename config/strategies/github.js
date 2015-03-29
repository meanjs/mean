'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	GithubStrategy = require('passport-github').Strategy,
	config = require('../config'),
	User = require('mongoose').model('User'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function() {
	// Use github strategy
	passport.use(new GithubStrategy({
			clientID: config.github.clientID,
			clientSecret: config.github.clientSecret,
			callbackURL: config.github.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;

			// Create the user OAuth profile
			var displayName = profile.displayName.trim();
			var iSpace = displayName.indexOf(' '); // index of the whitespace following the firstName
			var firstName =  iSpace !== -1 ? displayName.substring(0, iSpace) : displayName;
			var lastName = iSpace !== -1 ? displayName.substring(iSpace + 1) : '';

			var userData = {
				firstName: firstName,
				lastName: lastName,
				displayName: displayName,
				email: profile.emails[0].value,
				username: profile.username
			};

			// Save the user OAuth profile
			User.oAuthHandle(req.user, 'github', providerData.id, accessToken, refreshToken, providerData, userData, function(err, user, isNew) {
				users.saveOAuthUserProfile(err, user, isNew, done);
			});
		}
	));
};

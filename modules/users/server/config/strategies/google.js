'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	User = require('mongoose').model('User'),
	users = require('../../controllers/users.server.controller');

module.exports = function (config) {
	// Use google strategy
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
			passReqToCallback: true
		},
		function (req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;

			// Create the user OAuth profile
			var userData = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				profileImageURL: (providerData.picture) ? providerData.picture : undefined,
				provider: 'google',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			User.oAuthHandle(req.user, 'google', providerData.id, accessToken, refreshToken, providerData, userData, function (err, user, isNew) {
				users.saveOAuthUserProfile(err, user, isNew, done);
			});
		}
	));
};

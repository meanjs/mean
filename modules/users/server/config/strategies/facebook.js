'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	FacebookStrategy = require('passport-facebook').Strategy,
	users = require('../../controllers/users.server.controller');

module.exports = function(config) {
	// Use facebook strategy
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			profileFields: ['id', 'name', 'displayName', 'emails', 'photos'],
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				profileImageURL: (profile.photos && profile.photos.length) ? profile.photos[0].value : undefined,
				provider: 'facebook',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};

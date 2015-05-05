'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
		PayPalStrategy = require('passport-paypal-openidconnect').Strategy,
		config = require('../config'),
		users = require('../../app/controllers/users.server.controller');
/*
module.exports = function() {
	// Use google strategy
	passport.use(new PayPalStrategy({
				clientID: config.paypal.clientID,
				clientSecret: config.paypal.clientSecret,
				callbackURL: config.paypal.callbackURL,
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
					username: profile.username,
					provider: 'google',
					providerIdentifierField: 'id',
					providerData: providerData
				};

				// Save the user OAuth profile
				users.saveOAuthUserProfile(req, providerUserProfile, done);
			}
	));
};
*/
module.exports = function () {
	console.log(config);
	passport.use(new PayPalStrategy({
			clientID: config.paypal.clientID,
			clientSecret: config.paypal.clientSecret,
			callbackURL: config.paypal.callbackURL,
			scope: 'openid profile email',
			sandbox: config.paypal.sandbox,
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
				email: profile._json.email,
				username: profile.username,
				provider: 'paypal',
				providerIdentifierField: 'id',
				providerData: providerData
			};
			console.log(providerUserProfile);

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};


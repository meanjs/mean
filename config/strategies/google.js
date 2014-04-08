'use strict';

var passport = require('passport'),
	url = require('url'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	User = require('mongoose').model('User'),
	config = require('../config');

module.exports = function() {
	// Use google strategy
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: url.resolve(config.appUrl, config.google.callbackPath),
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			if (req.user) {
				return done(new Error('User is already signed in'), req.user);
			} else {
				User.findOne({
					'provider': 'google',
					'providerData.id': profile.id
				}, function(err, user) {
					if (!user) {
						var possibleUsername = profile.emails[0].value.split('@')[0];

						User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
							user = new User({
								firstName: profile.name.givenName,
								lastName: profile.name.familyName,
								displayName: profile.displayName,
								email: profile.emails[0].value,
								username: availableUsername,
								provider: 'google',
								providerData: profile._json
							});
							user.save(function(err) {
								return done(err, user);
							});
						});
					} else {
						return done(err, user);
					}
				});
			}
		}
	));
};

'use strict';

var passport = require('passport'),
	url = require('url'),
	LinkedInStrategy = require('passport-linkedin').Strategy,
	User = require('mongoose').model('User'),
	config = require('../config');

module.exports = function() {
	// Use linkedin strategy
	passport.use(new LinkedInStrategy({
			consumerKey: config.linkedin.clientID,
			consumerSecret: config.linkedin.clientSecret,
			callbackURL: url.resolve(config.appUrl, config.linkedin.callbackPath),
			passReqToCallback: true,
			profileFields: ['id', 'first-name', 'last-name', 'email-address']
		},
		function(req, accessToken, refreshToken, profile, done) {
			if (req.user) {
				return done(new Error('User is already signed in'), req.user);
			} else {
				User.findOne({
					'provider': 'linkedin',
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
								provider: 'linkedin',
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

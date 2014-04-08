'use strict';

var passport = require('passport'),
	url = require('url'),
	FacebookStrategy = require('passport-facebook').Strategy,
	User = require('mongoose').model('User'),
	config = require('../config');

module.exports = function() {
	// Use facebook strategy
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: url.resolve(config.appUrl, config.facebook.callbackPath),
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			if (req.user) {
				return done(new Error('User is already signed in'), req.user);
			} else {
				User.findOne({
					'provider': 'facebook',
					'providerData.id': profile.id
				}, function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						User.findUniqueUsername(profile.username, null, function(availableUsername) {
							user = new User({
								firstName: profile.name.givenName,
								lastName: profile.name.familyName,
								displayName: profile.displayName,
								email: profile.emails[0].value,
								username: availableUsername,
								provider: 'facebook',
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

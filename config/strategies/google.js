'use strict';

var passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	User = require('mongoose').model('User'),
	config = require('../config');

module.exports = function() {
	// Use google strategy
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({
				'providerData.id': profile.id
			}, function(err, user) {
				if (!user) {
					user = new User({
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
						displayName: profile.displayName,
						email: profile.emails[0].value,
						username: profile.emails[0].value,
						provider: 'google',
						providerData: profile._json
					});
					user.save(function(err) {
						if (err) console.log(err);
						return done(err, user);
					});
				} else {
					return done(err, user);
				}
			});
		}
	));
};
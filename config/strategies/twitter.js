'use strict';

var passport = require('passport'),
	url = require('url'),
	TwitterStrategy = require('passport-twitter').Strategy,
	User = require('mongoose').model('User'),
	config = require('../config');

module.exports = function() {
	// Use twitter strategy
	passport.use(new TwitterStrategy({
			consumerKey: config.twitter.clientID,
			consumerSecret: config.twitter.clientSecret,
			callbackURL: url.resolve(config.appUrl, config.twitter.callbackPath),
			passReqToCallback: true
		},
		function(req, token, tokenSecret, profile, done) {
			if (req.user) {
				return done(new Error('User is already signed in'), req.user);
			} else {
				User.findOne({
					'provider': 'twitter',
					'providerData.id_str': profile.id
				}, function(err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						User.findUniqueUsername(profile.username, null, function(availableUsername) {
							user = new User({
								displayName: profile.displayName,
								username: availableUsername,
								provider: 'twitter',
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

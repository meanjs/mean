'use strict';

var passport = require('passport'),
	TwitterStrategy = require('passport-twitter').Strategy,
	User = require('mongoose').model('User'),
	config = require('../config');

module.exports = function() {
	// Use twitter strategy
	passport.use(new TwitterStrategy({
			consumerKey: config.twitter.clientID,
			consumerSecret: config.twitter.clientSecret,
			callbackURL: config.twitter.callbackURL
		},
		function(token, tokenSecret, profile, done) {
			console.log(profile);
			User.findOne({
				'providerData.id_str': profile.id
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					user = new User({
						displayName: profile.displayName,
						username: profile.username,
						provider: 'twitter',
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
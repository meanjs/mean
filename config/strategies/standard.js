'use strict';

var passport = require('passport'),
	User = require('mongoose').model('User'),
	config = require('../config');

var strategies = ['facebook', 'google', 'linkedin', 'twitter'];

module.exports = function() {
	strategies.forEach(function(strategy) {
		var Strategy = (strategy === 'google') ?
			require('passport-google-oauth').OAuth2Strategy :
			require('passport-' + strategy).Strategy;
		passport.use(new Strategy({
				clientID: config[strategy].clientID,
				clientSecret: config[strategy].clientSecret,
				consumerKey: config[strategy].clientID,
				consumerSecret: config[strategy].clientSecret,
				callbackURL: config[strategy].callbackURL,
				profileFields: config[strategy].profileFields,
				passReqToCallback: true
			},
			function(req, accessToken, refreshToken, profile, done) {
				if (req.user) {
					return done(new Error('User is already signed in'), req.user);
				} else {
					User.findOne({
						'provider': strategy,
						'providerData.id': profile.id
					}, function(err, user) {
						if (err) {
							return done(err);
						}
						if (!user) {
							var possibleUsername = profile.username || profile.emails[0].value.split('@')[0];

							User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
								user = new User({
									firstName: profile.name.givenName,
									lastName: profile.name.familyName,
									displayName: profile.displayName,
									email: profile.emails[0].value,
									username: availableUsername,
									provider: strategy,
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
	});
};

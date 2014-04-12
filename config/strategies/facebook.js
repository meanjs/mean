'use strict';

var passport = require('passport'),
	url = require('url'),
	FacebookStrategy = require('passport-facebook').Strategy,
	User = require('mongoose').model('User'),
	config = require('../config'),
	users = require('../../app/controllers/users');

module.exports = function() {
	// Use facebook strategy
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: url.resolve(config.appUrl, config.facebook.callbackPath),
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {

			var providerData = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				provider: 'facebook',
				idKey: 'id',
				email: profile.emails[0].value,
				username: profile.username,
			};
			users.saveOrUpdate(req, accessToken, refreshToken, profile, done, providerData);

		}
	));
};

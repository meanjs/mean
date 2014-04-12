'use strict';

var passport = require('passport'),
	url = require('url'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	User = require('mongoose').model('User'),
	config = require('../config'),
	users = require('../../app/controllers/users');

module.exports = function() {
	// Use google strategy
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: url.resolve(config.appUrl, config.google.callbackPath),
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {

			var providerData = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				provider: 'google',
				idKey: 'id',
				email: profile.emails[0].value,
				username: profile.username
			};
			users.saveOrUpdate(req, accessToken, refreshToken, profile, done, providerData);

		}
	));
};

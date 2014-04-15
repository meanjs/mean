'use strict';

var passport = require('passport'),
	LinkedInStrategy = require('passport-linkedin').Strategy,
	User = require('mongoose').model('User'),
	config = require('../config'),
	users = require('../../app/controllers/users');

module.exports = function() {
	// Use linkedin strategy
	passport.use(new LinkedInStrategy({
			consumerKey: config.linkedin.clientID,
			consumerSecret: config.linkedin.clientSecret,
			callbackURL: config.linkedin.callbackURL,
			passReqToCallback: true,
			profileFields: ['id', 'first-name', 'last-name', 'email-address']
		},
		function(req, accessToken, refreshToken, profile, done) {

			var providerData = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				provider: 'linkedin',
				idKey: 'id',
				username: profile.displayName,
			};
			users.saveOrUpdate(req, accessToken, refreshToken, profile, done, providerData);

		}
	));
};
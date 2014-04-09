'use strict';

var passport = require('passport'),
	TwitterStrategy = require('passport-twitter').Strategy,
	User = require('mongoose').model('User'),
	config = require('../config'),
	users = require('../../app/controllers/users');

module.exports = function() {
	// Use twitter strategy
	passport.use(new TwitterStrategy({
			consumerKey: config.twitter.clientID,
			consumerSecret: config.twitter.clientSecret,
			callbackURL: config.twitter.callbackURL,
			passReqToCallback: true
		},
		function(req, token, tokenSecret, profile, done) {

			var providerData = {
				displayName: profile.displayName,
                provider: 'twitter',
                idKey: 'id_str',
                username: profile.username,
            };

            users.saveOrUpdate(req, token, tokenSecret, profile, done, providerData);
		}
	));
};
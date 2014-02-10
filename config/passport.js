'use strict';

var mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy,
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	LinkedInStrategy = require('passport-linkedin').Strategy,
	User = mongoose.model('User'),
	config = require('./config');


module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -hashed_password', function(err, user) {
			done(err, user);
		});
	});

	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
		},
		function(email, password, done) {
			User.findOne({
				email: email
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Unknown user'
					});
				}
				if (!user.authenticate(password)) {
					return done(null, false, {
						message: 'Invalid password'
					});
				}
				return done(null, user);
			});
		}
	));

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

	// Use facebook strategy
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({
				'providerData.id': profile.id
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					user = new User({
						firstName: profile.name.givenName,
						lastName: profile.name.familyName,
						displayName: profile.displayName,
						email: profile.emails[0].value,
						username: profile.username,
						provider: 'facebook',
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
						username: profile.username,
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

	// Use linkedin strategy
	passport.use(new LinkedInStrategy({
			consumerKey: config.linkedin.clientID,
			consumerSecret: config.linkedin.clientSecret,
			callbackURL: config.linkedin.callbackURL,
			profileFields: ['id', 'first-name', 'last-name', 'email-address']
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
						username: profile.username,
						provider: 'linkedin',
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
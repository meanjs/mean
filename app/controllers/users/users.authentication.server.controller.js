'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, info) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(info && info.redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	// Define search query fields
	var searchProviderIdentifierField = 'providers.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

	// Define provider search query
	var providerSearchQuery = {};
	providerSearchQuery[searchProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

	User.findOne(providerSearchQuery, function(err, user) {
		if (err) {
			return done(err);
		}

		if (req.user) {
			if (user) {
				// TODO: update callback handling (message/redirectURL flow);
				if (req.user.providers && req.user.providers[providerUserProfile.provider] &&
					req.user.providers[providerUserProfile.provider][providerUserProfile.providerIdentifierField] == providerUserProfile.providerData[providerUserProfile.providerIdentifierField]) {
					return done(null, req.user);
				} else {
					return done(null, req.user, { message: 'This provider is connected to another account.', redirectURL: '/#!/settings/accounts' });
				}
			}

			user = req.user;

			if (!user.providers) user.providers = {};

			user.providers[providerUserProfile.provider] = providerUserProfile.providerData;
			user.markModified('providers');

			// And save the user
			user.save(function(err) {
				return done(err, user, { redirectURL: '/#!/settings/accounts' });
			});
		} else if (!user) {
			var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

			User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
				user = new User({
					username: availableUsername,
					name: providerUserProfile.displayName,
					email: providerUserProfile.email,
					providers: {}
				});

				user.providers[providerUserProfile.provider] = providerUserProfile.providerData;

				// And save the user
				user.save(function(err) {
					return done(err, user);
				});
			});
		} else {
			return done(err, user);
		}
	});
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.providers && user.providers[provider]) {
			delete user.providers[provider];

			user.markModified('providers');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	}
};

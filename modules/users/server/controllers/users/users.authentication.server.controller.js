'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Signup
 */
exports.signup = function (req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user
	user.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function (err) {
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
exports.signin = function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function (err) {
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
exports.signout = function (req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (req, res, next) {
	passport.authenticate(req.oauthProvider, function (err, user, redirectURL) {
		if (err || !user) {
			return res.redirect('/#!/signin');
		}
		req.login(user, function (err) {
			if (err) {
				return res.redirect('/#!/signin');
			}

			return res.redirect(redirectURL || '/');
		});
	})(req, res, next);
};

/**
 * Helper function to save or update a OAuth user profile WTF is that?
 */
exports.saveOAuthUserProfile = function (err, user, isNew, done) {
	if (err) {
		return done(err);
	}
	if (!user) {
		return done(new Error('No user returned by Strategy'));
	}
	if (isNew) {
		return done(null, user);
	}
	done(null, user, '/#!/settings/accounts');
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res) {
	var user = req.user;
	var provider = req.param('provider');
	var id = req.param('id');

	if (user && provider && id) {

		user.removeIdentity(provider, id);
		user.markModified('identities');

		user.save(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function (err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).json('Invalid parameters');
	}
};

exports.oauthAccept = function (req, res) {
	switch (req.oauthProvider) {
		case 'facebook':
		{
			return passport.authenticate('facebook', {
				scope: ['email']
			})(req, res);
		}
		case 'twitter':
		{
			return passport.authenticate('twiter')(req, res);
		}
		case 'google':
		{
			return passport.authenticate('google', {
				scope: [
					'https://www.googleapis.com/auth/userinfo.profile',
					'https://www.googleapis.com/auth/userinfo.email'
				]
			})(req, res);
		}
		case 'linkedin':
		{
			return passport.authenticate('linkedin', {
				scope: [
					'r_basicprofile',
					'r_emailaddress'
				]
			})(req, res);
		}
		case 'github':
		{
			return passport.authenticate('github')(req, res);
		}

	}
	res.status('400').json('Unsupported provider');
}


exports.oauthProviderByName = function (req, res, next, id) {
	req.oauthProvider = id;
	next();
};


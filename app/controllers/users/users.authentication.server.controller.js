'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('../errors'),
	passport = require('passport'),
    userAuthenticationService = require('../../services/users.authentication.server.service');

/**
 * Signup
 */
exports.signup = function(req, res) {
    // Signup user throughout service
    userAuthenticationService.signup(req.body, function(err, user){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        // login user
        req.login(user, function(err) {
            if (err) {
                return res.status(400).send(err);
            }

            return res.jsonp(user);
        });
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local',
        function(err, user, info) {
            userAuthenticationService.authenticate(err, user, info, function (err, user) {
                if (err || !user) {
                    return res.status(400).send(info);
                }

                req.login(user, function (err) {
                    if (err) {
                        return res.status(400).send(err);
                    }

                    return res.jsonp(user);
                });
            });
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
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
        userAuthenticationService.saveNewOAuthUserProfile(
            providerUserProfile,
            function(err, user){
                return done(err, user);
            }
        );
	} else {
        userAuthenticationService.saveExistingOAuthUserProfile(
            req.user,
            providerUserProfile,
            function(err, user){
                if (err){
                    return done(err, user);
                }

                return done(null, user, '/#!/settings/accounts');
            }
        );
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var provider = req.param('provider');

    userAuthenticationService.removeOAuthProvider(req.user, provider, function(err, user){
        if (err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        req.login(user, function(err) {
            if (err) {
                return res.status(400).send(err);
            }

            return res.jsonp(user);
        });
    });
};
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    errorHandler = require('../errors'),
    userPassService = require('../../services/users.password.server.service');

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
    userPassService.forgotPassword(req.body.username, req.headers.host, function(err, email){
        if (err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.send({
            message: 'An email has been sent to ' + email + ' with further instructions.'
        });
    });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {
    userPassService.validateResetToken(req.params.token, function(err, user){
		if (err) {
			return res.redirect('/#!/password/reset/invalid');
		}

		res.redirect('/#!/password/reset/' + req.params.token);
	});
};

/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;

    userPassService.resetPassword(req.params.token, passwordDetails, function(err, user){
        if (err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        req.login(user, function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }

            // Return authenticated user
            res.jsonp(user);
        });
    });
};

/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
    userPassService.changePassowrd(req.user, req.body, function(err, user){
        if (err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        // Try to login
        req.login(user, function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }

            res.send({
                message: 'Password changed successfully'
            });
        });
    });
};
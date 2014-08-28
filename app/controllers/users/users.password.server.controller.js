'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	config = require('../../../config/config'),
	nodemailer = require('nodemailer'),
	crypto = require('crypto'),
	async = require('async'),
    userPassService = require('../../services/users.password.server.service');

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
    userPassService.forgotPassword(req.body.username, req.headers.host, function(err, email){
        if (err){
            return res.status(400).send({
                message: err.message
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
                message: err.message
            });
        }

        req.login(user, function(err) {
            if (err) {
                return res.status(400).send({
                    message: err.message
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
	// Init Variables
	var passwordDetails = req.body;
	var message = null;

	if (req.user) {
		if (passwordDetails.newPassword) {
			User.findById(req.user.id, function(err, user) {
				if (!err && user) {
					if (user.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
							user.password = passwordDetails.newPassword;

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
											res.send({
												message: 'Password changed successfully'
											});
										}
									});
								}
							});
						} else {
							res.status(400).send({
								message: 'Passwords do not match'
							});
						}
					} else {
						res.status(400).send({
							message: 'Current password is incorrect'
						});
					}
				} else {
					res.status(400).send({
						message: 'User is not found'
					});
				}
			});
		} else {
			res.status(400).send({
				message: 'Please provide a new password'
			});
		}
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};
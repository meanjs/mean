'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
    userProfileService = require('../../services/users.profile.server.service');

/**
 * Update user details
 */
exports.update = function(req, res) {
    userProfileService.update(req.user, req.body, function(err, user) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        req.login(user, function (err) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.jsonp(user);
            }
        });
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};
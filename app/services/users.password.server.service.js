'use strict';

var async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    emailService = require('./email.server.service'),
    config = require('../../config/config'),
    utilsService = require('./utils.server.service');

/**
 * Forgot Password Service:
 *  1. find the user
 *  2. generate new token
 * @param username - {String}
 * @param callback - {Function} - in the form of function(err, email);
 */
exports.forgotPassword = function(username, hostname, callback){
    async.waterfall([
        // Search for the user
        function(done) {
            User.findByUsername(username, function(err, user){
                if (err){
                    return done(err);
                }

                if (user === null){
                    return done (new Error('No user found'));
                }

                done(null, user);
            });
        },
        // Generate a new token
        function(user, done){
            utilsService.generateToken(function(err, token){
                done(err, user, token);
            });
        },
        // Save new token
        function(user, token, done){
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function(err) {
                done(err, user, token);
            });
        },
        // send email
        function(user, token, done){
            var options = {
                template : {
                    path : 'app/views/templates/reset-password-email.server.view.html',
                    renderOptions : {
                        name: user.displayName,
                        appName: config.app.title,
                        url: 'http://' + hostname + '/auth/reset/' + token
                    }
                },
                email : {
                    to: user.email,
                    subject: 'Password Reset',
                }
            };
            emailService.sendTemplate(options, function(err){
                done(err, user.email);
            });
        }
    ], function(err, email){
        callback(err, email);
    });
};

/**
 * Service validation for a specific token
 * @param token - {String}
 * @param callback - {Function} in the form of function(err)
 */
exports.validateResetToken = function(token, callback){
    User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (err){
            return callback(err);
        }
        if (!user) {
            return callback(new Error('No user found'));
        }

        return callback(null);
    });
};
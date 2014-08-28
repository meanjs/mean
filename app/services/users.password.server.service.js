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
                    subject: 'Password Reset'
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
 * @param callback - {Function} in the form of function(err, user)
 *          err - {Error}
 *          user - {User}
 */
 function validateResetToken(token, callback){
    User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function(err, user) {
        if (err){
            return callback(err, null);
        }
        if (!user) {
            return callback(new Error('No user found'), null);
        }

        return callback(null, user);
    });
};
exports.validateResetToken = validateResetToken;

/**
 * Service to reset a password according to a specified token
 * @param token - {String} - the token of the reset request
 * @param passwordDetails - {Object} in the form of:
 *          {
 *              newPassword : {String} the new password
 *              verifyPassword {String} the password again
 *          }
 * @param callback - {Function} in the form of callback(err, user)
 *          err - {Error}
 *          user - {User}
 */
exports.resetPassword = function(token, passwordDetails, callback){
    async.waterfall([

        function(done) {
            validateResetToken(token, function (err, user) {
                done(err, user);
            });
        },
        function(user, done){
            if (passwordDetails.newPassword !== passwordDetails.verifyPassword) {
                done(new Error('Passwords do not match'));
            }

            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
                if (err) {
                    return callback(err, null);
                }

                done(err, user);
            });
        },
        // send email
        function(user, done){
            var options = {
                template : {
                    path : 'app/views/templates/reset-password-confirm-email.server.view.html',
                    renderOptions : {
                        name: user.displayName,
                        appName: config.app.title
                    }
                },
                email : {
                    to: user.email,
                    subject: 'Your password has been changed'
                }
            };
            emailService.sendTemplate(options, function(err){
                done(err, user);
            });
        }
    ], function(err, user) {
        callback(err, user);
    });
};

/**
 * Service to change a user passowrd
 * @param user - {User} one to change his password
 * @param passwordDetails - {Object} in the form of :
 *          {
 *              currentPassword : {String} the current password
 *              newPassword : {String} the new password
 *              verifyPassword : {String} the password again
 *          }
 * @param callback - {Function} in the form of callback(err, user)
 *          err - {Error}
 *          user - {User}
 */
exports.changePassowrd = function(user, passwordDetails, callback){

    async.waterfall([
        // Password exact verififcation
        function(done){
            if (passwordDetails.newPassword && passwordDetails.newPassword === passwordDetails.verifyPassword){
                return done(null);
            }

            return done(new Error('Password do not match or missing'));
        },
        // Find the user
        function(done){
            User.findById(user.id, function(err, user){
                if (err){
                    return done(err);
                }

                if (!user){
                    return done(new Error('Could not find a user'));
                }

                return done(err, user);
            })
        },
        // Try to authenticate
        function(user, done){
            if (!user.authenticate(passwordDetails.currentPassword)){
                return done(new Error('Could not authenticate user'));
            }
            return done(null, user);
        },
        // Change Password
        function(user, done){
            user.password = passwordDetails.newPassword;

            user.save(function(err){
                return done(err, user);
            });
        }
    ], function(err, user) {
        callback(err, user);
    });
};
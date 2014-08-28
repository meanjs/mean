'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

exports.update = function(user, details, callback){
    // For security measurement we remove the roles from the req.body object
    delete user.roles;

    if (user) {
        // Merge existing user
        user = _.extend(user, details);
        user.updated = Date.now();
        user.displayName = user.firstName + ' ' + user.lastName;

        user.save(function(err) {
            if (err) {
                return callback(err, null);
            }

            callback(null, user);
        });
    } else {
        return callback(new Error('User is not signed in'), null);
    }
};
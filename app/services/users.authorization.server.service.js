'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Find user by id
 * @param id - {String} user id to find
 * @param callback - {Function} callback(err, user)
 *          err - {Error}
 *          user - {User}
 */
exports.userByID = function(id, callback) {
    User.findOne({
        _id: id
    }).exec(function(err, user) {
        if (err){
            return callback(err, null);
        }

        return callback(null, user);
    });
};
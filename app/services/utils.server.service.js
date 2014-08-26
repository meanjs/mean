'use strict';

var crypto = require('crypto');

/**
 * Service to generate 20 bytes token
 * @param callback - {Function} in the form of function(err, token)
 *      err - {Error}
 *      token - {String}
 */
exports.generateToken = function(callback) {
    crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        callback(err, token);
    });
};
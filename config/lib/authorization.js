'use strict';

var config = require('../config'),
  jwt = require('jsonwebtoken');

// build token auth service
var tokenAuth = {
  signToken: signAuthToken
};

// export the token auth service
module.exports = tokenAuth;

// Sign a token
function signAuthToken (user) {
  return new Promise(function (resolve, reject) {
    try {

      var payload = {
        user: user._id,
        expiration: Date.now() + (config.jwt.expiresInSeconds * 1000)
      };

      var options = {
        expiresIn: config.jwt.expiresInSeconds
      };

      var token = jwt.sign(payload, config.jwt.secret, options);

      resolve(token);

    } catch (err) {
      reject(err);
    }
  });
}

'use strict';

var config = require('../config'),
  jwt = require('jsonwebtoken');



// export the token auth service
exports.signToken = function (user) {
  var payload = {
    user: user._id,
    expiration: Date.now() + (config.jwt.expiresInSeconds * 1000)
  };

  var options = {
    expiresIn: config.jwt.expiresInSeconds
  };

  var token = jwt.sign(payload, config.jwt.secret, options);

  return token;
};

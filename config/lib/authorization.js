'use strict';

var config = require('../config'),
  jwt = require('jsonwebtoken'),
  lodash = require('lodash');

var auth = {
  signToken: signToken
};

// Export the token auth service
module.exports = auth;

// Sign the Token
function signToken(user, options) {
  var payload,
    token,
    jwtOptions;

  if (!user || !user._id) {
    return null;
  }

  options = options || {};

  payload = {
    user: user._id.toString()
  };

  jwtOptions = lodash.merge(config.jwt.options, options);

  token = jwt.sign(payload, config.jwt.secret, jwtOptions);

  return token;
}

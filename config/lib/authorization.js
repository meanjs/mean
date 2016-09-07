'use strict';

var config = require('../config'),
  jwt = require('jsonwebtoken'),
  lodash = require('lodash'),
  passport = require('passport');

var auth = {
  signToken: signToken,
  authorize: authorizeRequest
};

// Export the token auth service
module.exports = auth;

function authorizeRequest(req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user) {
    if (err) {
      return next(new Error(err));
    }

    if (user) {
      req.user = user;
    }

    next();
  })(req, res, next);
}

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

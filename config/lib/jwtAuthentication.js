'use strict';

var config = require('../config'),
  jwt = require('jsonwebtoken'),
  lodash = require('lodash');



// export the token auth service
exports.signToken = function (user, options) {
  var payload,
    defaults,
    token,
    jwtOptions;

  payload = {
    user: user._id
  };

  defaults = {
    expiresIn: config.jwt.expiresInSeconds
  };

  if(options) {
    jwtOptions = lodash.merge(defaults, options);
  } else {
    jwtOptions = defaults;
  }

  token = jwt.sign(payload, config.jwt.secret, jwtOptions);

  return token;
};

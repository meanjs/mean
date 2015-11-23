'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  User.findOne({
    _id: id
  }, { loginExpires: 0, loginToken: 0 })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};

function requiresLoginTokenCheck(req, callback) {
  // check for login token here
  var loginToken = req.headers.authentication || req.body.loginToken;
  // query DB for the user corresponding to the token and act accordingly
  User.findOne({
    loginToken: loginToken,
    loginExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    callback(err, user);
  });
}
exports.requiresLoginTokenCheck = requiresLoginTokenCheck;

/**
 * Require login token routing middleware
 */
exports.requiresLoginToken = function (req, res, next) {
  requiresLoginTokenCheck(req, function (err, user) {
    if (!user) {
      return res.status(401).send({
        message: 'Token is incorrect or has expired. Please login again'
      });
    }
    if (err) {
      return res.status(500).send({
        message: 'There was an internal server error processing your login token'
      });
    }
    // bind user object to request and continue
    req.user = user;
    next();
  });
};

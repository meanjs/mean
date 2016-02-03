'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  JwtStrategy = require('passport-jwt').Strategy,
  User = require('mongoose').model('User');

module.exports = function (config) {

  var opts = {};
  opts.secretOrKey = config.jwt.secret;
  //opts.issuer = "accounts.examplesoft.com";
  //opts.audience = "yoursite.net";
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findById({ _id: jwt_payload.user }, '-salt -password', function(err, user) {
      if (err) {
        return done(err, false);
      }

      if (user) {
        

        return done(null, user);
      }

      return done('User not found');
    });
  }));
};

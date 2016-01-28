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
    User.findOne({ _id: jwt_payload.user }, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        //Protect salt/password
        user.salt = null;
        user.password = null;
        //console.log(user);
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));

  /*
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function (username, password, done) {
    User.findOne({
      username: username.toLowerCase()
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid username or password'
        });
      }

      return done(null, user);
    });
  }));
  */
};

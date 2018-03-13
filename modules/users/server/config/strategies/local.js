/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = () => {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'usernameOrEmail',
    passwordField: 'password'
  },
  (usernameOrEmail, password, done) => {
    User.findOne({
      $or: [{
        username: usernameOrEmail.toLowerCase()
      }, {
        email: usernameOrEmail.toLowerCase()
      }]
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
        });
      }

      return done(null, user);
    });
  }));
};

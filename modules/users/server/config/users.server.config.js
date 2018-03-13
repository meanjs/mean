/**
 * Module dependencies
 */
var passport = require('passport'),
  User = require('mongoose').model('User'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

/**
 * Module init function
 */
module.exports = app => {
  // Serialize sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser((id, done) => {
    User.findOne({
      _id: id
    }, '-salt -password', (err, user) => {
      done(err, user);
    });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(strategy => {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};

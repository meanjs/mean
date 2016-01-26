'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller'),
    passport = require('passport');

  // Setting up the users profile api
  app.route('/api/users/me').get(passport.authenticate('jwt', { session: false }), users.me);
  app.route('/api/users').put(passport.authenticate('jwt', { session: false }), users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};

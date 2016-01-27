'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller'),
    passport = require('passport'),
    express = require('express'),
    router = express.Router();

  //Set JWT Auth for all user Routes
  router.all('*', passport.authenticate('jwt', { session: false }));

  // Setting up the users profile api
  router.route('/me').get(users.me);
  router.route('/').put(users.update);
  router.route('/accounts').delete(users.removeOAuthProvider);
  router.route('/password').post(users.changePassword);
  router.route('/picture').post(users.changeProfilePicture);

  app.use('/api/users', router);
};

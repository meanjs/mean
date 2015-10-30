'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api

  app.route('/api/users/me').get(users.me); // Let inquiries through, users.me to return null if not logged in)
  app.route('/api/users').put(users.requiresLoginToken, users.update);
  app.route('/api/users/accounts').delete(users.requiresLoginToken, users.removeOAuthProvider);
  app.route('/api/users/password').post(users.requiresLoginToken, users.changePassword);
  app.route('/api/users/picture').post(users.requiresLoginToken, users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.requiresLoginToken, users.userByID);
};

'use strict';

module.exports = function (app) {
  // Profile Routes
  var profile = require('../controllers/profile.server.controller');

  // Single profile routes
  app.route('/api/profile/:username').get(profile.read);

  // Finish by binding the user middleware
  app.param('username', profile.userByUsername);
};

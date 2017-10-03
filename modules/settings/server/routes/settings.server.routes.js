'use strict';

/**
 * Module dependencies
 */
var settingsPolicy = require('../policies/settings.server.policy'),
  settings = require('../controllers/settings.server.controller');

module.exports = function(app) {
  // Settings Routes
  app.route('/api/settings').all(settingsPolicy.isAllowed)
    .get(settings.list)
    .post(settings.create);

  app.route('/api/settings/:settingId').all(settingsPolicy.isAllowed)
    .get(settings.read)
    .put(settings.update)
    .delete(settings.delete);

  // Finish by binding the Setting middleware
  app.param('settingId', settings.settingByID);
};

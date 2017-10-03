'use strict';

/**
 * Module dependencies
 */
var customizingsPolicy = require('../policies/customizings.server.policy'),
  customizings = require('../controllers/customizings.server.controller');

module.exports = function(app) {
  // Customizings Routes
  app.route('/api/customizings').all(customizingsPolicy.isAllowed)
    .get(customizings.list)
    .post(customizings.create);

  app.route('/api/customizings/:customizingId').all(customizingsPolicy.isAllowed)
    .get(customizings.read)
    .put(customizings.update)
    .delete(customizings.delete);

  // Finish by binding the Customizing middleware
  app.param('customizingId', customizings.customizingByID);
};

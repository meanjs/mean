'use strict';

/**
 * Module dependencies
 */
var addingsPolicy = require('../policies/addings.server.policy'),
  addings = require('../controllers/addings.server.controller');

module.exports = function(app) {
  // Addings Routes
  app.route('/api/addings').all(addingsPolicy.isAllowed)
    .get(addings.list)
    .post(addings.create);

  app.route('/api/addings/:addingId').all(addingsPolicy.isAllowed)
    .get(addings.read)
    .put(addings.update)
    .delete(addings.delete);

  // Finish by binding the Adding middleware
  app.param('addingId', addings.addingByID);
};

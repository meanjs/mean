'use strict';

/**
 * Module dependencies
 */
var optionsPolicy = require('../policies/options.server.policy'),
  options = require('../controllers/options.server.controller');

module.exports = function(app) {
  // Options Routes
  app.route('/api/options').all(optionsPolicy.isAllowed)
    .get(options.list)
    .post(options.create);

  app.route('/api/options/:optionId').all(optionsPolicy.isAllowed)
    .get(options.read)
    .put(options.update)
    .delete(options.delete);

  // Finish by binding the Option middleware
  app.param('optionId', options.optionByID);
};

'use strict';

/**
 * Module dependencies
 */
var settIngsPolicy = require('../policies/sett-ings.server.policy'),
  settIngs = require('../controllers/sett-ings.server.controller');

module.exports = function(app) {
  // Sett ings Routes
  app.route('/api/sett-ings').all(settIngsPolicy.isAllowed)
    .get(settIngs.list)
    .post(settIngs.create);

  app.route('/api/sett-ings/:settIngId').all(settIngsPolicy.isAllowed)
    .get(settIngs.read)
    .put(settIngs.update)
    .delete(settIngs.delete);

  // Finish by binding the Sett ing middleware
  app.param('settIngId', settIngs.settIngByID);
};

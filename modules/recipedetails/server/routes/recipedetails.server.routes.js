'use strict';

/**
 * Module dependencies
 */
var recipedetailsPolicy = require('../policies/recipedetails.server.policy'),
  recipedetails = require('../controllers/recipedetails.server.controller');

module.exports = function(app) {
  // Recipedetails Routes
  app.route('/api/recipedetails').all(recipedetailsPolicy.isAllowed)
    .get(recipedetails.list)
    .post(recipedetails.create);

  app.route('/api/recipedetails/:recipedetailId').all(recipedetailsPolicy.isAllowed)
    .get(recipedetails.read)
    .put(recipedetails.update)
    .delete(recipedetails.delete);

  // Finish by binding the Recipedetail middleware
  app.param('recipedetailId', recipedetails.recipedetailByID);
};

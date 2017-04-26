'use strict';

/**
 * Module dependencies
 */
var imagegalleriesPolicy = require('../policies/imagegalleries.server.policy'),
  imagegalleries = require('../controllers/imagegalleries.server.controller');

module.exports = function(app) {
  // Imagegalleries Routes
  app.route('/api/imagegalleries').all(imagegalleriesPolicy.isAllowed)
    .get(imagegalleries.list)
    .post(imagegalleries.create);

  app.route('/api/imagegalleries/:imagegalleryId').all(imagegalleriesPolicy.isAllowed)
    .get(imagegalleries.read)
    .put(imagegalleries.update)
    .delete(imagegalleries.delete);

  // Finish by binding the Imagegallery middleware
  app.param('imagegalleryId', imagegalleries.imagegalleryByID);
};

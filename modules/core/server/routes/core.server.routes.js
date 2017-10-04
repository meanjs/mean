'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller.js'), //Public view
    //categories = require('../controllers/categories.server.controller.js'), //TODO enable category routing and item sorting.
    //express = require('express'), 
    //router = express.Router();

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);

  // Render main home for no login, or for public/apply
  app.route('/public/apply').get(core.renderIndex)
  						   .post(core.apply); //For adding user applications

  //TODO enforce admin login check below this point in controllers.
};
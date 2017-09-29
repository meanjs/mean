'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller'), //Public view
    items = require('../controllers/items.server.controller.js'),
    //categories = require('../controllers/categories.server.controller.js'), //TODO enable category routing and item sorting.
    users = require('../controllers/users.server.controller.js');
    express = require('express'), 
    router = express.Router();

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);

//User schema: approvedStatus, role, modulesAssigned 

//Item schema: name, uniqueID, workingStatus, comment, categories, 

//Category schema: name, backref:itemList, 

  // Render main home for no login, or for public/apply
  app.route('public/apply').get(core.renderIndex)
  						   .post(core.apply); //For adding user applications

  //TODO enforce login check below this point in controllers.
  app.route('items').get(items.list)
  					.post(items.create);
  app.route('items/:itemID').get(items.read)
  							.put(items.update)
  							.delete(items.delete);
  app.param('itemID', items.itemByID);



  //TODO enforce admin login check below this point in controllers.
  app.route('users').get(users.list)
  					.post(users.create);
  app.route('users/:userID').get(users.read)
  							.put(users.update)
  							.delete(users.delete);
  app.param('userID', users.itemByID);
};

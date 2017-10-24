'use strict';

/**
 * Module dependencies
 */
var itemsPolicy = require('../policies/items.server.policy'),
  items = require('../controllers/items.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/items').all(itemsPolicy.isAllowed)
    .get(items.list)
    .post(items.create);

  // Single article routes
  app.route('/api/items/:itemId').all(itemsPolicy.isAllowed)
    .get(items.read)
    .put(items.update)
    .delete(items.delete);

    app.route('/api/categories').all(itemsPolicy.isAllowed)
    .get(items.listAllCategories)
    .post(items.createCategory)
    .delete(items.deleteCategory);

    app.route('/api/modules').all(itemsPolicy.isAllowed)
    .get(items.listAllModules)
    .post(items.createModule)
    .delete(items.deleteModule);

    //We will list, delete and post new tags all from the same page.
    //We will also list tags in dropdown checkboxes for item creation or editing.

  // Finish by binding the article middleware
  app.param('itemId', items.itemByID);
};
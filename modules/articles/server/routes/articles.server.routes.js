'use strict';

/**
 * Module dependencies
 */
var itemsPolicy = require('../policies/articles.server.policy'),
  items = require('../controllers/articles.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create);

  // Single article routes
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

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
  app.param('articleId', articles.articleByID);
};
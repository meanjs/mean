'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');

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

    app.route('/api/categories').all(articlesPolicy.isAllowed)
    .get(articles.listAllCategories)
    .post(articles.createCategory)
    .delete(articles.deleteCategory);

    app.route('/api/modules/:categoryId').all(articlesPolicy.isAllowed)
    .delete(articles.deleteCategory);

    app.route('/api/modules').all(articlesPolicy.isAllowed)
    .get(articles.listAllModules)
    .post(articles.createModule);

    app.route('/api/modules/:moduleId').all(articlesPolicy.isAllowed)
    .delete(articles.deleteModule);    

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);
  app.param('categoryId', articles.categoryByID);
  app.param('moduleId', articles.moduleByID);

};
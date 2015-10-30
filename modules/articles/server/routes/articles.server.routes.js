'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller'),
  users = require(path.resolve('./modules/users/server/controllers/users.server.controller'));

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(users.requiresLoginToken, articles.create);

  // Single article routes
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(users.requiresLoginToken, articles.read)
    .put(users.requiresLoginToken, articles.update)
    .delete(users.requiresLoginToken, articles.delete);

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);
};

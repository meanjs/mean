'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  express = require('express'),
  articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');


module.exports = function (app) {
  var router = express.Router();


  // Articles collection routes
  router.route('/')
    .get(articlesPolicy.isAllowed, articles.list)
    .post(passport.authenticate('jwt', { session: false }), articlesPolicy.isAllowed, articles.create);

  // Single article routes
  router.route('/:articleId')
    .get(articlesPolicy.isAllowed, articles.read)
    .put(passport.authenticate('jwt', { session: false }), articlesPolicy.isAllowed, articles.update)
    .delete(passport.authenticate('jwt', { session: false }), articlesPolicy.isAllowed, articles.delete);

  // Finish by binding the article middleware
  router.param('articleId', articles.articleByID);

  app.use('/api/articles', router);
};

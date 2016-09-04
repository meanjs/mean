'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  MongooseFiltering = require(path.resolve('./modules/core/server/controllers/mongoose-filtering.server.controller'));

/**
 * Create an article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var article = req.article ? req.article.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  article.isCurrentUserOwner = !!(req.user && article.user && article.user._id.toString() === req.user._id.toString());

  res.json(article);
};

/**
 * Update an article
 */
exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

exports.parameterizedQuery = function (req, res) {
  var searchRequest = req.body;

  // Add default sorting if not provided with the request
  if (!searchRequest.sorting || !searchRequest.sorting.length) {
    // Note: It may be a good idea to disable sorting
    // on large collections due to performance issues.
    // For instance, when the collection size is greater
    // than 100,000. Sorting on an indexed field should
    // yield good performance, even on large
    // collections.
    searchRequest.sorting = '_id';
  }

  // Set base query.
  var query = Article.find();

  var filterService = new MongooseFiltering(query, searchRequest);

  // Build parameterized query based on the specific
  // request, using the base query. The resolved
  // promise will return the modified query.
  filterService.pageSortFilter(true)
    .then(onQueryBuildSuccess)
    .catch(onQueryBuildError);

  // On successful building of the parameterized query.
  function onQueryBuildSuccess(result) {
    query = result.query;

    // Now we can add any additional querying logic
    // that might be specific to this controller method

    // Populate the User field
    query.populate('user', 'displayName');

    // Finally, execute the Mongoose find()
    // method on our modified query.
    query.exec('find', function (err, articles) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json({
          count: result.count,
          articles: articles
        });
      }
    });
  }

  function onQueryBuildError(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  // Allows paging options to be
  // sent as query-string parameters.
  var searchRequest = {
    take: Number(req.query.take) || null,
    page: Number(req.query.page) || null
  };

  // Set base query
  var query = Article.find();

  var filterService = new MongooseFiltering(query, searchRequest);

  // Build parameterized query based on the specific
  // request, using the base query. The resolved
  // promise will return the modified query.
  filterService.pageSortFilter()
    .then(onQueryBuildSuccess)
    .catch(onQueryBuildError);

  // On successful building of the parameterized query.
  function onQueryBuildSuccess(result) {
    query = result.query;

    query.sort('-created').populate('user', 'displayName').exec('find', function (err, articles) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(articles);
      }
    });
  }

  function onQueryBuildError(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};

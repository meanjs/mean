'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Recipedetail = mongoose.model('Recipedetail'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Recipedetail
 */
exports.create = function(req, res) {
  var recipedetail = new Recipedetail(req.body);
  recipedetail.user = req.user;

  recipedetail.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recipedetail);
    }
  });
};

/**
 * Show the current Recipedetail
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var recipedetail = req.recipedetail ? req.recipedetail.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  recipedetail.isCurrentUserOwner = req.user && recipedetail.user && recipedetail.user._id.toString() === req.user._id.toString();

  res.jsonp(recipedetail);
};

/**
 * Update a Recipedetail
 */
exports.update = function(req, res) {
  var recipedetail = req.recipedetail;

  recipedetail = _.extend(recipedetail, req.body);

  recipedetail.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recipedetail);
    }
  });
};

/**
 * Delete an Recipedetail
 */
exports.delete = function(req, res) {
  var recipedetail = req.recipedetail;

  recipedetail.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recipedetail);
    }
  });
};

/**
 * List of Recipedetails
 */
exports.list = function(req, res) {
  Recipedetail.find().sort('-created').populate('user', 'displayName').exec(function(err, recipedetails) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recipedetails);
    }
  });
};

/**
 * Recipedetail middleware
 */
exports.recipedetailByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Recipedetail is invalid'
    });
  }

  Recipedetail.findById(id).populate('user', 'displayName').exec(function (err, recipedetail) {
    if (err) {
      return next(err);
    } else if (!recipedetail) {
      return res.status(404).send({
        message: 'No Recipedetail with that identifier has been found'
      });
    }
    req.recipedetail = recipedetail;
    next();
  });
};

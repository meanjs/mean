'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Imagegallery = mongoose.model('Imagegallery'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Imagegallery
 */
exports.create = function(req, res) {

  var imagegallery = new Imagegallery(req.body);

  imagegallery.user = req.user;

  imagegallery.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(imagegallery);
    }
  });
};

/**
 * Show the current Imagegallery
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var imagegallery = req.imagegallery ? req.imagegallery.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  imagegallery.isCurrentUserOwner = req.user && imagegallery.user && imagegallery.user._id.toString() === req.user._id.toString();

  res.jsonp(imagegallery);
};

/**
 * Update a Imagegallery
 */
exports.update = function(req, res) {
  var imagegallery = req.imagegallery;

  imagegallery = _.extend(imagegallery, req.body);

  imagegallery.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(imagegallery);
    }
  });
};

/**
 * Delete an Imagegallery
 */
exports.delete = function(req, res) {
  var imagegallery = req.imagegallery;

  imagegallery.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(imagegallery);
    }
  });
};

/**
 * List of Imagegalleries
 */
exports.list = function(req, res) {
  Imagegallery.find().sort('-created').populate('user', 'displayName').exec(function(err, imagegalleries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(imagegalleries);
    }
  });
};

/**
 * Imagegallery middleware
 */
exports.imagegalleryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Imagegallery is invalid'
    });
  }

  Imagegallery.findById(id).populate('user', 'displayName').exec(function (err, imagegallery) {
    if (err) {
      return next(err);
    } else if (!imagegallery) {
      return res.status(404).send({
        message: 'No Imagegallery with that identifier has been found'
      });
    }
    req.imagegallery = imagegallery;
    next();
  });
};

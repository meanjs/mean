'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customizing = mongoose.model('Customizing'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Customizing
 */
exports.create = function(req, res) {
  var customizing = new Customizing(req.body);
  customizing.user = req.user;

  customizing.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customizing);
    }
  });
};

/**
 * Show the current Customizing
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var customizing = req.customizing ? req.customizing.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  customizing.isCurrentUserOwner = req.user && customizing.user && customizing.user._id.toString() === req.user._id.toString();

  res.jsonp(customizing);
};

/**
 * Update a Customizing
 */
exports.update = function(req, res) {
  var customizing = req.customizing;

  customizing = _.extend(customizing, req.body);

  customizing.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customizing);
    }
  });
};

/**
 * Delete an Customizing
 */
exports.delete = function(req, res) {
  var customizing = req.customizing;

  customizing.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customizing);
    }
  });
};

/**
 * List of Customizings
 */
exports.list = function(req, res) {
  Customizing.find().sort('-created').populate('user', 'displayName').exec(function(err, customizings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(customizings);
    }
  });
};

/**
 * Customizing middleware
 */
exports.customizingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customizing is invalid'
    });
  }

  Customizing.findById(id).populate('user', 'displayName').exec(function (err, customizing) {
    if (err) {
      return next(err);
    } else if (!customizing) {
      return res.status(404).send({
        message: 'No Customizing with that identifier has been found'
      });
    }
    req.customizing = customizing;
    next();
  });
};

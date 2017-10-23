'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adding = mongoose.model('Adding'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

exports.test = function(req, res) {
  var body = req.body;

  res.json(body);
}

/**
 * Create a Adding
 */
exports.create = function(req, res) {
  var adding = new Adding(req.body);
  adding.user = req.user;

  adding.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adding);
    }
  });
};

/**
 * Show the current Adding
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adding = req.adding ? req.adding.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adding.isCurrentUserOwner = req.user && adding.user && adding.user._id.toString() === req.user._id.toString();

  res.jsonp(adding);
};

/**
 * Update a Adding
 */
exports.update = function(req, res) {
  var adding = req.adding;

  adding = _.extend(adding, req.body);

  adding.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adding);
    }
  });
};

/**
 * Delete an Adding
 */
exports.delete = function(req, res) {
  var adding = req.adding;

  adding.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adding);
    }
  });
};

/**
 * List of Addings
 */
exports.list = function(req, res) {
  Adding.find().sort('-created').populate('user', 'displayName').exec(function(err, addings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(addings);
    }
  });
};

/**
 * Adding middleware
 */
exports.addingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adding is invalid'
    });
  }

  Adding.findById(id).populate('user', 'displayName').exec(function (err, adding) {
    if (err) {
      return next(err);
    } else if (!adding) {
      return res.status(404).send({
        message: 'No Adding with that identifier has been found'
      });
    }
    req.adding = adding;
    next();
  });
};

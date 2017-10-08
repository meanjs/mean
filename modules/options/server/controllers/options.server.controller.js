'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Option = mongoose.model('Option'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Option
 */
exports.create = function(req, res) {
  var option = new Option(req.body);
  option.user = req.user;

  option.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(option);
    }
  });
};

/**
 * Show the current Option
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var option = req.option ? req.option.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  option.isCurrentUserOwner = req.user && option.user && option.user._id.toString() === req.user._id.toString();

  res.jsonp(option);
};

/**
 * Update a Option
 */
exports.update = function(req, res) {
  var option = req.option;

  option = _.extend(option, req.body);

  option.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(option);
    }
  });
};

/**
 * Delete an Option
 */
exports.delete = function(req, res) {
  var option = req.option;

  option.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(option);
    }
  });
};

/**
 * List of Options
 */
exports.list = function(req, res) {
  Option.find().sort('-created').populate('user', 'displayName').exec(function(err, options) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(options);
    }
  });
};

/**
 * Option middleware
 */
exports.optionByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Option is invalid'
    });
  }

  Option.findById(id).populate('user', 'displayName').exec(function (err, option) {
    if (err) {
      return next(err);
    } else if (!option) {
      return res.status(404).send({
        message: 'No Option with that identifier has been found'
      });
    }
    req.option = option;
    next();
  });
};

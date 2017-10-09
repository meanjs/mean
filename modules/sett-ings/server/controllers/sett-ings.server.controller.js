'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  SettIng = mongoose.model('SettIng'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Sett ing
 */
exports.create = function(req, res) {
  var settIng = new SettIng(req.body);
  settIng.user = req.user;

  settIng.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(settIng);
    }
  });
};

/**
 * Show the current Sett ing
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var settIng = req.settIng ? req.settIng.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  settIng.isCurrentUserOwner = req.user && settIng.user && settIng.user._id.toString() === req.user._id.toString();

  res.jsonp(settIng);
};

/**
 * Update a Sett ing
 */
exports.update = function(req, res) {
  var settIng = req.settIng;

  settIng = _.extend(settIng, req.body);

  settIng.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(settIng);
    }
  });
};

/**
 * Delete an Sett ing
 */
exports.delete = function(req, res) {
  var settIng = req.settIng;

  settIng.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(settIng);
    }
  });
};

/**
 * List of Sett ings
 */
exports.list = function(req, res) {
  SettIng.find().sort('-created').populate('user', 'displayName').exec(function(err, settIngs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(settIngs);
    }
  });
};

/**
 * Sett ing middleware
 */
exports.settIngByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Sett ing is invalid'
    });
  }

  SettIng.findById(id).populate('user', 'displayName').exec(function (err, settIng) {
    if (err) {
      return next(err);
    } else if (!settIng) {
      return res.status(404).send({
        message: 'No Sett ing with that identifier has been found'
      });
    }
    req.settIng = settIng;
    next();
  });
};

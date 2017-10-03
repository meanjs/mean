'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Setting = mongoose.model('Setting'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Setting
 */
exports.create = function(req, res) {
  var setting = new Setting(req.body);
  setting.user = req.user;

  setting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(setting);
    }
  });
};

/**
 * Show the current Setting
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var setting = req.setting ? req.setting.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  setting.isCurrentUserOwner = req.user && setting.user && setting.user._id.toString() === req.user._id.toString();

  res.jsonp(setting);
};

/**
 * Update a Setting
 */
exports.update = function(req, res) {
  var setting = req.setting;

  setting = _.extend(setting, req.body);

  setting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(setting);
    }
  });
};

/**
 * Delete an Setting
 */
exports.delete = function(req, res) {
  var setting = req.setting;

  setting.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(setting);
    }
  });
};

/**
 * List of Settings
 */
exports.list = function(req, res) {
  Setting.find().sort('-created').populate('user', 'displayName').exec(function(err, settings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(settings);
    }
  });
};

/**
 * Setting middleware
 */
exports.settingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Setting is invalid'
    });
  }

  Setting.findById(id).populate('user', 'displayName').exec(function (err, setting) {
    if (err) {
      return next(err);
    } else if (!setting) {
      return res.status(404).send({
        message: 'No Setting with that identifier has been found'
      });
    }
    req.setting = setting;
    next();
  });
};

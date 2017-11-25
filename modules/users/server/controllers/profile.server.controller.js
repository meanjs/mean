'use strict';

/**
 * Module dependencies
 */
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * Show the selected user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};

/**
 * User middleware
 */
exports.userByUsername = function (req, res, next, username) {
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + username));
    }

    req.model = user;
    next();
  });
};

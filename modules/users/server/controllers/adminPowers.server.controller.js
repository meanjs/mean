'use strict';

/**
 * Module dependencies that sends the info from the clinet controller to the database in mlab
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User that is edited by the admin in the client side edit-user controller to the mLab
 */
exports.updateUser = function (req, res) {
  var user = req.user;

  if (req.body !== null) {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.displayName = user.firstName + ' ' + user.lastName;
    user.roles = req.body.roles;
    user.comments = req.body.comments;
    user.approve = req.body.approve;
  }

  /* Save the user */
  user.save(function (err) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(user);
    }
  });
};

/**
 * Delete a user that is edited by the admin in the client side edit-user controller to the mLab
 */
exports.deleteUser = function (req, res) {
  var user = req.user;

  /* Remove the user */
  user.remove(function (err) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.end();
    }
  });
};

/**
 * User middleware
 */
exports.participantByID = function (req, res, next, id) {
  User.findById(id).exec(function (err, user) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      req.user = user;
      req.model = user;
      next();
    }
  });
};

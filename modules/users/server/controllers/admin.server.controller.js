'use strict';

/**
 * Module dependencies
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
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Admin creates user
 */
exports.adminsignup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  //delete req.body.roles;

  var user = new User(req.body);
  user.provider = 'local';
  user.approvedStatus = true;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      res.status(200).send();
    }
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

exports.unapprovedList = function(req, res) {
  User
    .find({ approvedStatus: false })
    .sort('-created')
    .populate('user', 'displayName')
    .exec(function(err, unapprovedUsers) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.json(unapprovedUsers);
    });
}

exports.changeToAccepted = function (req, res) {
  var unapprovedUser = req.body;
  User.findOneAndUpdate({'username' : unapprovedUser.username}, {$set: {'approvedStatus' : true}}, function(err, changedUser) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(changedUser);
  });
}


exports.deleteApplicant = function (req, res) {
  var unapprovedUser = req.query;
  if (unapprovedUser) {
    User.findOneAndRemove({'username': unapprovedUser.username, 'approvedStatus': false}, function (err) {
      if (err) throw err;
      console.log(unapprovedUser.approvedStatus);
    });
  }
}

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

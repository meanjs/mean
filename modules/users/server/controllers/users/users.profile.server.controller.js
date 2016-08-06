'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  async = require('async'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // For security measurement do not use _id from the req.body object
  delete req.body._id;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  var tmpImageUrl;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    async.series({
      uploadImage: function (callback) {
        upload(req, res, function (uploadError) {
          if (uploadError) {
            callback({
              message: 'Error occurred while uploading profile picture'
            });
          } else {
            callback(null);
          }
        });
      },
      saveUser: function(callback) {
        tmpImageUrl = user.profileImageURL;
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;
        user.save(callback);
      },
      deleteOldImage: function (callback) {
        if (tmpImageUrl !== User.schema.path('profileImageURL').defaultValue) {
          fs.unlink(tmpImageUrl, function (unlinkError) {
            if (unlinkError) {
              callback({
                message: 'Error occurred while uploading profile picture'
              });
            } else {
              callback(null);
            }
          });
        } else {
          callback(null);
        }
      },
      login: function (callback) {
        req.login(user, callback);
      }
    }, function(err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(user);
      }
    });

  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};

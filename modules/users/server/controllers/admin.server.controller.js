'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

const mailer = require('./mailer.js');
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
  var user = new User(req.body);
  user.provider = 'local';
  user.approvedStatus = true;
  var genHexPassword = function(length){
        var str="Pa";
        for(var i=0; i<length; i++){
          var toAdd = Math.floor(Math.random()*16.0);
          if(toAdd < 10){
            str+=toAdd;  
          }
          if(toAdd == 10){
            str+="A"; 
          }
          if(toAdd == 11){
            str+="B"; 
          }
          if(toAdd == 12){
            str+="C"; 
          }
          if(toAdd == 13){
            str+="D"; 
          }
          if(toAdd == 14){
            str+="E"; 
          }
          if(toAdd == 15){
            str+="F"; 
          }
        }
        return str+"!";
  };
  var tempUnhashed = genHexPassword(7);
  user.password = tempUnhashed;
  user.save(function (err) {
    if (err) {
      tempUnhashed="";
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
        
      });
    } else {
      // Remove sensitive data before login
      res.status(200).send();
      mailer.sendCreation(user.email, user.firstName, user.username, tempUnhashed);
      tempUnhashed="";
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
  User.find({ approvedStatus: true }, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec(function (err, users) {
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
};

exports.changeToAccepted = function (req, res) {
  var unapprovedUser = req.body;
  User.findOneAndUpdate({'username' : unapprovedUser.username}, {$set: {'approvedStatus' : true, 'roles': unapprovedUser.roles}}, function(err, changedUser) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(changedUser);
    mailer.sendAcceptance(unapprovedUser.email, unapprovedUser.firstName);
  });
};


exports.deleteApplicant = function (req, res) {
  var unapprovedUser = req.query;
  if (unapprovedUser) {
    User.findOneAndRemove({'username': unapprovedUser.username, 'approvedStatus': false}, function (err) {
      if (err) throw err;
      console.log(unapprovedUser.approvedStatus);
    });
  }
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
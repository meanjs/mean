'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config')),
  nev = require('email-verification')(mongoose);

// Setup node-email-verification
var config_nev = function () {

  nev.configure({
    tempUserCollection: 'tempusers_collection',
    verificationURL: 'http://' + config.host + ':' + config.port + '/verification/${URL}',
    persistentUserModel: User,

    transportOptions: config.mailer.options,

    // No templating support in node-email-verification yet
    // https://github.com/whitef0x0/node-email-verification/issues/51
    verifyMailOptions: {
      from: config.mailer.from,
      subject: 'Verify your ' + config.app.title + ' account',
      html: '<p>Please verify your account by clicking <a href="${URL}">here</a>, or by copying and ' + 'pasting the following link into your browser:</p><p>${URL}</p>',
      text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}'
    },
    confirmMailOptions: {
      from: config.mailer.from,
      subject: 'Account verified',
      html: '<p>Your ' + config.app.title + ' account has been verified.</p>',
      text: 'Your ' + config.app.title + ' account has been verified.'
    },
    shouldSendConfirmation: true,
    verifySendMailCallback: function(err, info) {
      if (err) {
        throw err;
      }
    }
  }, function(err, options) {
    if (err) {
      throw err;
    }
  });

  nev.generateTempUserModel(User, function(err) {
    if (err) {
      throw err;
    }
  });

};

config_nev();

exports.validateVerificationToken = function(req, res) {
  nev.confirmTempUser(req.params.token, function(err, user) {
    if (err) {
      return res.status(500).send({ message: errorHandler.getErrorMessage(err) });
    } else if (user) {
      return res.status(200).send({ message: 'User successfully verified' });
    } else {
      // redirect to resend verification email
      return res.status(400).send({ message: 'Verification token is invalid or has expired.' });
    }
  });
};

exports.resendVerificationEmail = function(req, res, next) {
  nev.resendVerificationEmail(req.body.email, function(err, userFound) {
    if (err) {
      return res.status(500).send({ message: errorHandler.getErrorMessage(err) });
    }

    if (userFound) {
      res.status(200).send({ message: 'Successfully re-sent verification email. Please check your email.' });
    } else {
      res.status(400).send({ message: 'Error: Email not found' });
    }
  });
};

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Only require email verification if configuration variable is set
  if (config.verifyUserEmail) {

    nev.createTempUser(user, function (err, existingPersistentUser, newTempUser) {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      if (existingPersistentUser) {
        if (err) {
          return res.status(400).send({
            message: 'Error: username already exists'
          });
        }
      }

      // New user created
      if (newTempUser) {
        var URL = newTempUser[nev.options.URLFieldName];
        nev.sendVerificationEmail(user.email, URL, function (err, info) {
          console.log(err);
          if (err) {
            return res.status(400).send({
              message: 'Error: mail server down'
            });
          } else {
            return res.status(200).send('An email has been sent to you. Please check it to verify your account.');
          }
        });
      } else {
        return res.status(400).send({ message: 'Error: User already waiting to be verified!' });
      }
    });

  } else {
    // Save the user directly to user model
    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;

        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  }
};


'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  User = mongoose.model('User');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
	'/authentication/signin',
	'/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
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
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
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
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      } else if (!user) {
        return res.redirect('/authentication/signin');
      }

      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(redirectURL || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  // Define search query fields
  var searchProviderIdentifierField = 'providers.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

  // Define provider search query
  var providerSearchQuery = {};
  providerSearchQuery[searchProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

  User.findOne(providerSearchQuery, function(err, user) {
    if (err) {
      return done(err);
    }

    if (req.user) {
      if (user) {
        // TODO: update callback handling (message/redirectURL flow);
        if (req.user.providers && req.user.providers[providerUserProfile.provider] &&
          req.user.providers[providerUserProfile.provider][providerUserProfile.providerIdentifierField] === providerUserProfile.providerData[providerUserProfile.providerIdentifierField]) {
          return done(null, req.user, { message: 'User is already connected using this provider', redirectURL: '/settings/accounts' });
        } else {
          return done(null, req.user, { message: 'This provider is connected to another account.', redirectURL: '/settings/accounts' });
        }
      }

      user = req.user;

      if (!user.providers) user.providers = {};

      user.providers[providerUserProfile.provider] = providerUserProfile.providerData;
      user.markModified('providers');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else if (!user) {
      var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

      User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
        user = new User({
          firstName: providerUserProfile.firstName,
          lastName: providerUserProfile.lastName,
          username: availableUsername,
          displayName: providerUserProfile.displayName,
          email: providerUserProfile.email,
          profileImageURL: providerUserProfile.profileImageURL,
          providers: {}
        });

        user.providers[providerUserProfile.provider] = providerUserProfile.providerData;

        // And save the user
        user.save(function(err) {
          return done(err, user);
        });
      });
    } else {
      return done(err, user);
    }
  });
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the provider
  if (user.providers && user.providers[provider]) {
    delete user.providers[provider];

    // Then tell mongoose that we've updated the providers field
    user.markModified('providers');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};

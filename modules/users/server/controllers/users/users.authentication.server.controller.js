/**
 * Module dependencies
 */
const path = require('path');

const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');

// URLs for which user can't be redirected on signin
const noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = (req, res) => {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  const user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(err => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, err => {
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
exports.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, err => {
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
exports.signout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = (req, res, next) => {
  const strategy = req.params.strategy;
  // Authenticate
  passport.authenticate(strategy)(req, res, next);
};

/**
 * OAuth callback
 */
exports.oauthCallback = (req, res, next) => {
  const strategy = req.params.strategy;

  // info.redirect_to contains inteded redirect path
  passport.authenticate(strategy, (err, user, info) => {
    if (err) {
      return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
    }
    if (!user) {
      return res.redirect('/authentication/signin');
    }
    req.login(user, err => {
      if (err) {
        return res.redirect('/authentication/signin');
      }

      return res.redirect(info.redirect_to || '/');
    });
  })(req, res, next);
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = (req, providerUserProfile, done) => {
  // Setup info and user objects
  const info = {};
  let user;

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1) {
    info.redirect_to = req.session.redirect_to;
  }

  // Define a search query fields
  const searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
  const searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

  // Define main provider search query
  const mainProviderSearchQuery = {};
  mainProviderSearchQuery.provider = providerUserProfile.provider;
  mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

  // Define additional provider search query
  const additionalProviderSearchQuery = {};
  additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

  // Define a search query to find existing user with current provider profile
  const searchQuery = {
    $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
  };

  // Find existing user with this provider account
  User.findOne(searchQuery, (err, existingUser) => {
    if (err) {
      return done(err);
    }

    if (!req.user) {
      if (!existingUser) {
        const possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

        User.findUniqueUsername(possibleUsername, null, availableUsername => {
          user = new User({
            firstName: providerUserProfile.firstName,
            lastName: providerUserProfile.lastName,
            username: availableUsername,
            displayName: providerUserProfile.displayName,
            profileImageURL: providerUserProfile.profileImageURL,
            provider: providerUserProfile.provider,
            providerData: providerUserProfile.providerData
          });

          // Email intentionally added later to allow defaults (sparse settings) to be applid.
          // Handles case where no email is supplied.
          // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
          user.email = providerUserProfile.email;

          // And save the user
          user.save(err => done(err, user, info));
        });
      } else {
        return done(err, existingUser, info);
      }
    } else {
      // User is already logged in, join the provider data to the existing user
      user = req.user;

      // Check if an existing user was found for this provider account
      if (existingUser) {
        if (user.id !== existingUser.id) {
          return done(new Error('Account is already connected to another user'), user, info);
        }

        return done(new Error('User is already connected using this provider'), user, info);
      }

      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(err => done(err, user, info));
    }
  });
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = (req, res, next) => {
  const user = req.user;
  const provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(err => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, err => {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};

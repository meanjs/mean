'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use google strategy
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
      passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        emails: mapEmails(profile.emails),
        username: profile.username,
        profileImageURL: (providerData.picture) ? providerData.picture : undefined,
        provider: 'google',
        providerIdentifierField: 'id',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));

  function mapEmails(emails) {
    return emails.map(function (email, i) {
      return {
        address: email.value,
        isPrimary: i === 0
      };
    });
  }
};

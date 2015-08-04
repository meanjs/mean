'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  LinkedInStrategy = require('passport-linkedin').Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use linkedin strategy
  passport.use(new LinkedInStrategy({
      consumerKey: config.linkedin.clientID,
      consumerSecret: config.linkedin.clientSecret,
      callbackURL: config.linkedin.callbackURL,
      passReqToCallback: true,
      profileFields: ['id', 'first-name', 'last-name', 'email-address', 'picture-url']
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
        profileImageURL: (providerData.pictureUrl) ? providerData.pictureUrl : undefined,
        provider: 'linkedin',
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

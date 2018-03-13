/**
 * Module dependencies
 */
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const users = require('../../controllers/users.server.controller');

module.exports = config => {
  // Use google strategy
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    passReqToCallback: true,
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  },
    (req, accessToken, refreshToken, profile, done) => {
      // Set the provider data and include tokens
      const providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      const providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        profileImageURL: (providerData.picture) ? providerData.picture : undefined,
        provider: 'google',
        providerIdentifierField: 'id',
        providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};

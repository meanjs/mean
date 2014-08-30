'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Signs up a user
 * @param usr - {Object} an user json object
 * @param callback - {Function} in the form of callback(err, user)
 *          err - {Error}
 *          user - {User}
 */
exports.signup = function(usr, callback){
    // For security measurement we remove the roles from the req.body object
    delete usr.roles;

    // Init Variables
    var user = new User(usr);

    // Add missing user fields
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;

    // Then save the user
    user.save(function(err) {
        if (err) {
            return callback(err, null);
        }

        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;

        return callback(null, user);
    });
};

/**
 * Authenticate user for passport usage
 * @param err - {Error}
 * @param user - {User}
 * @param info - {String}
 * @param callback - {Function} callback(err, user)
 *          err - {Error}
 *          user - {User}
 */
exports.authenticate = function(err, user, info, callback){
    if (err || !user) {
        return callback(new Error(info), null);
    }

    // Remove sensitive data before login
    user.password = undefined;
    user.salt = undefined;

    return callback(null, user);
};

/**
 * Helper service to save new OAuth user profile
 * @param providerUserProfile - {Object}
 * @param callback - {Function} in the form of callback(err, user)
 *          err - {Error}
 *          user - {User}
 */
exports.saveNewOAuthUserProfile = function(providerUserProfile, callback) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
        $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
        if (err) {
            return callback(err, null);
        }

        if (!user) {
            var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

            User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                user = new User({
                    firstName: providerUserProfile.firstName,
                    lastName: providerUserProfile.lastName,
                    username: availableUsername,
                    displayName: providerUserProfile.displayName,
                    email: providerUserProfile.email,
                    provider: providerUserProfile.provider,
                    providerData: providerUserProfile.providerData
                });

                // And save the user
                user.save(function (err) {
                    return callback(err, null);
                });
            });
        } else {
            return callback(err, user);
        }
    });
};


/**
 * Helper service to update existing OAuth user profile
 * @param user - {User}
 * @param providerUserProfile - {Object}
 * @param callback - {Function} in the form of callback(err, user)
 *          err - {Error}
 *          user - {User}
 */
exports.saveExistingOAuthUserProfile = function(user, providerUserProfile, callback) {
    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
        // Add the provider data to the additional provider data field
        if (!user.additionalProvidersData) user.additionalProvidersData = {};
        user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

        // Then tell mongoose that we've updated the additionalProvidersData field
        user.markModified('additionalProvidersData');

        // And save the user
        user.save(function (err) {
            return callback(err, user);
        });
    } else {
        return callback(new Error('User is already connected using this provider'), null);
    }
};

/**
 * Remove OAuth provider
 * @param user - {User}
 * @param provider - {String}
 * @param callback - {Function} callback(err, user)
 *          err - {Error}
 *          user - {User}
 */
exports.removeOAuthProvider = function(user, provider, callback) {
    if (user && provider) {
        // Delete the additional provider
        if (user.additionalProvidersData[provider]) {
            delete user.additionalProvidersData[provider];

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');
        }

        user.save(function(err) {
            if (err) {
                return callback(err, null);
            }

            return callback(null, user);
        });
    }
};
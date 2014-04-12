'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	_ = require('lodash');

var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Signup
 */
exports.signup = function(req, res) {
	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	user.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.send(400, err);
				} else {
					res.jsonp(user);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.send(400, info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.send(400, err);
				} else {
					res.jsonp(user);
				}
			});
		}
	})(req, res, next);
};

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.send(400, err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.send(400, {
			message: 'User is not signed in'
		});
	}
};

/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;
	var message = null;

	if (req.user) {
		User.findById(req.user.id, function(err, user) {
			if (!err && user) {
				if (user.authenticate(passwordDetails.currentPassword)) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;

						user.save(function(err) {
							if (err) {
								return res.send(400, {
									message: getErrorMessage(err)
								});
							} else {
								req.login(user, function(err) {
									if (err) {
										res.send(400, err);
									} else {
										res.send({
											message: 'Password changed successfully'
										});
									}
								});
							}
						});

					} else {
						res.send(400, {
							message: 'Passwords do not match'
						});
					}
				} else {
					res.send(400, {
						message: 'Current password is incorrect'
					});
				}
			} else {
				res.send(400, {
					message: 'User is not found'
				});
			}
		});
	} else {
		res.send(400, {
			message: 'User is not signed in'
		});
	}
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, email) {
			if (err || !user) {
				console.log(err);
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect('/');
			});
		})(req, res, next);
	};
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.send(401, 'User is not logged in');
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.profile.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}

	next();
};

/**
 * Helper function to save or update a user.
 * When the user is logged in, it joins the user data to the existing one.
 * Otherwise it creates a new user.
 *
 * @author Kentaro Wakayama
 *
 * @date   2014-04-09
 *
 * @param  {Object}   req          This is the request object which contains the user when he is signed in.
 * @param  {String}   token        This is the accesstoken.
 * @param  {String}   tokenSecret  This is the refreshtoken.
 * @param  {Object}   profile      This is the user profile of the current provider.
 * @param  {Function} done         Callback to supply Passport with the user that authenticated.
 *
 * @param  {Object}   providerData This Object contains all data which is specific for the provider
 * @param  {String}   providerData.provider This is the passport provider name.
 * @param  {String}   providerData.idKey This is the Key / Attribute name for saving / retrieving the provider id.
 * @param  {String}   providerData.name This is the user's name.
 * @param  {String}   [providerData.email] This is the user's email.
 * @param  {String}   providerData.username This is the user's username.
 *
 * @return {[type]}                [description]
 */
exports.saveOrUpdate = function(req, token, tokenSecret, profile, done, providerData) {
	var provider = providerData.provider;
	var idKey = providerData.idKey;
	var searchProviderKey = provider + '.' + idKey;
	var searchObject = {};
	searchObject[searchProviderKey] = profile.id;

	if (!req.user) {
		// no user active, this is a fresh login
		User.findOne(searchObject, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {

				var possibleUsername = '';
				if (providerData.email) {
					possibleUsername = providerData.email.split('@')[0];
				} else {
					possibleUsername = profile.username;
				}

				User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
					user = new User({
						firstName: providerData.firstName,
						lastName: providerData.lastName,
						username: availableUsername,
						displayName: providerData.displayName,
						email: providerData.email,
						provider: provider,
					});

					user[provider] = profile._json;
					user[provider].token = token;
					user[provider].tokenSecret = tokenSecret;
					user.save(function(err) {
						if (err) console.log(err);
						return done(err, user);
					});
				});
			} else {
				user[provider].token = token;
				user[provider].tokenSecret = tokenSecret;
				user.save(function(err) {
					if (err) console.log(err);
					return done(err, user);
				});
			}
		});
	} else {
		// a user is already logged in, join the provider data to the existing user.
		User.findById( req.user._id, function(err, user) {
			if (err) {
				return done(err);
			}
			if (user) {
				user[provider] = profile._json;
				user[provider].token = token;
				user[provider].tokenSecret = tokenSecret;
				user.save(function(err) {
					if (err) console.log(err);
					return done(err, user);
				});
			} else {
				return done(err, user);
			}
		});
	}
};
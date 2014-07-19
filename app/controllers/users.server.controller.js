'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	_ = require('lodash');
	/* Requires for reset password */
var	nodemailer = require('nodemailer');
var	LocalStrategy = require('passport-local').Strategy;
var	bcrypt = require('bcrypt-nodejs');
var	async = require('async');
var	crypto = require('crypto');

/**
 * Get the error message from error object
 */
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
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user 
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
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
    async.waterfall([
    	// Generate random token
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        // Lookup user by email address
        function(token, done) {
        	if (req.body.email) {
	        	User.findOne({ email: req.body.email }, function(err, user) {
	          		if (!user) {
	            		return res.send(400, {
							message: 'No account with that email address exists'
						});
	          		}

	          		user.resetPasswordToken = token;
	          		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

	          		user.save(function(err) {
	          		    done(err, token, user);
	          		});
	        	});
	        } else {
	        	return res.send(400, {
	        		message: 'Email field must not be blank'
	        	});
	        }

      	},
      	// If valid email, send reset email using service
      	function(token, user, done) {
      		var smtpTransport = nodemailer.createTransport('SMTP', {
        		service: 'SendGrid', // Choose email service, default SendGrid
        		auth: {
          			user: 'your_sendgrid_email@domain.com',
          			pass: 'your_sendgrid_password'
        		}
      		});
      		var mailOptions = {
        		to: user.email,
        		from: 'your_email@domain.com',
        		subject: 'Password Reset',
        		text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          		'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          		'http://' + req.headers.host + '/auth/reset/' + token + '\n\n' +
          		'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      		};
      		smtpTransport.sendMail(mailOptions, function(err) {
      			res.send(200, {
					message: 'An email has been sent to ' + user.email + ' with further instructions.'
				});
				done(err, 'done');
      		});
    	}
    ], function(err) {
    	if (err) return next(err);
  	});
};

/**
 * Reset password GET from email token
 */
exports.resetGet = function(req, res) {
  	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    	if (!user) {
    		// res.render('404');
       		res.send(400, {
					message: 'Password reset token is invalid or has expired.'
			});
      		return res.redirect('/#!/forgot');
    	}

  		res.redirect('/#!/reset/' + req.params.token);

  	});
};

/**
 * Reset password POST from email token
 */
exports.resetPost = function(req, res) {
	// Init Variables
    var passwordDetails = req.body;
    var message = null;

	async.waterfall([
    	function(done) {
      		User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	            if (!err && user) {
                    if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                        user.password = passwordDetails.newPassword;
                        user.resetPasswordToken = undefined;
        				user.resetPasswordExpires = undefined;

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
                                        done(err, user);
                                    }
                                });
                            }
                        });
                    } else {
                        return res.send(400, {
                            message: 'Passwords do not match'
                        });
                    }
	            } else {
	                return res.send(400, {
	                    message: 'Password reset token is invalid or has expired.'
	                });
	            }
      		});
    	},
    	function(user, done) {
      		var smtpTransport = nodemailer.createTransport('SMTP', {
        		service: 'SendGrid',
        		auth: {
          			user: 'your_sendgrid_email@domain.com',
          			pass: 'your_sendgrid_password'
        		}
      		});
      		var mailOptions = {
        		to: user.email,
        		from: 'your_email@domain.com',
        		subject: 'Your password has been changed',
        		text: 'Hello,\n\n' +
          		'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      		};
      		smtpTransport.sendMail(mailOptions, function(err) {
      			res.send(200, {
					message: 'Password changed successfully'
				});
      		});
    	}
  	], function(err) {
    	res.redirect('/');
  	});
};

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

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
		if (passwordDetails.newPassword) {
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
				message: 'Please provide a new password'
			});
		}
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
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
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
		return res.send(401, {
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.send(403, {
					message: 'User is not authorized'
				});
			}
		});
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
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

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
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
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

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
	}
};
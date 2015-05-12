'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	UserModel,
	eachAsync = require('each-async');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	displayName: {
		type: String,
		trim: true
	},
	identities: [{
		provider: {type: String},
		id: {type: String},
		accessToken: {type: String},
		refreshToken: {type: String},
		providerData: {type: Object},
		confirmed: {type: Boolean}
	}],
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	profileImageURL: {
		type: String,
		default: 'modules/users/img/profile/default.png'
	},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

UserSchema.virtual('email').get(function () {
	return this.getIdentity(UserModel.EMAIL);
}).set(function (email) {
	this.setIdentity(UserModel.EMAIL, email);
});

UserSchema.virtual('username').get(function () {
	return this.getIdentity(UserModel.USERNAME);
}).set(function (username) {
	this.setIdentity(UserModel.USERNAME, username);
});

/**
 * Hook a pre save method to hash the password
 */

UserSchema.pre('save', function (next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	if (!this.identities || this.identities.length === 0) {
		return next();
	}
	var _this = this;
	eachAsync(this.identities, function (identity, index, done) {
		UserModel.findByProvider(identity.provider, identity.id, function (err, user) {
			if (err) {
				return next(err);
			}
			if (user === null) {
				return done();
			}
			if (!_this._id || _this._id.toString() !== user._id.toString()) {
				return next(new Error(identity.provider + ' : ' + identity.id + ' is assinged to other user'));
			}
			return done();
		});
	}, function (error) {
		if (error) {
			return next(error);
		}
		next();
	});
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
	return this.password === this.hashPassword(password);
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.setIdentity = function (provider, id, accessToken, refreshToken, providerData) {
	var found = false;
	var auth = {
		provider: provider,
		id: id
	};
	if (!this.identities) {
		this.identities = [];
	}
	this.identities.forEach(function (identity) {
		if (identity.provider === provider && identity.id === id) {
			auth = identity;
			found = true;
		}
	});
	auth.accessToken = accessToken || null;
	auth.refreshToken = refreshToken || null;
	auth.providerData = providerData || null;
	if (!found) {
		this.identities.push(auth);
	}
};

UserSchema.methods.getIdentity = function (provider, id) {
	var auth = null;
	if (this.identities) {
		
		this.identities.forEach(function (identity) {
			if (identity.provider === provider && (identity.id === id || id === undefined || id === null )) {
				auth = identity;
			}
		});
	}
	return auth;
};

UserSchema.methods.removeIdentity = function (provider, id) {
	if (this.identities) {
		var c = this.identities.length - 1;
		while (c >= 0) {
			if (this.identities[c] && this.identities[c].provider === provider && this.identities[c].id === id) {
				this.identities.pull(this.identities[c]);
			}
			c--;
		}
	}
};


UserSchema.methods.removeOtherIdentity = function (provider, id) {
	if (this.identities) {
		this.identities.forEach(function (auth, idx) {
			if (auth.provider === provider && auth.id !== id) {
				this.identities.splice(idx, 1);
			}
		});
	}
};

UserSchema.methods.isIdentityConfirmed = function (provider, id) {
	var identity = this.getIdentity(provider, id);
	if (identity) {
		return !!identity.confirmed;
	}
};

UserSchema.methods.setIdentityConfirmed = function (provider, id, confirmed) {
	var identity = this.getIdentity(provider, id);
	if (identity) {
		identity.confirmed = confirmed;
	} else {
		throw new Error('Identity of type ' + provider + ' is not set');
	}
};


/**
 * Find possible not used username
 */
UserSchema.statics.findByProvider = function (provider, id, callback) {

	var providerQuery = provider;

	if (Array.isArray(provider)) {
		providerQuery = {
			'$in': provider
		};
	}

	this.findOne({
		identities: {
			$elemMatch: {
				provider: providerQuery,
				id: id
			}
		}
	}, function (err, user) {
		if (!err) {
			return callback(null, user);
		} else {
			callback(null);
		}
	});
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	this.findByProvider(UserModel.USERNAME, possibleUsername, function (err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

UserSchema.statics.oAuthHandle = function (currentUser, provider, id, accessToken, refreshToken, providerData, userData, callback) {
	if (!currentUser) {
		UserModel.findByProvider(provider, id, function (err, user) {
			if (err) {
				return callback(err);
			}
			if (!user) {
				var possibleUsername = userData.username || ((userData.email) ? userData.email.split('@')[0] : '');
				return UserModel.findUniqueUsername(possibleUsername, null, function (availableUserName) {
					user = new UserModel(userData);
					user.setIdentity(provider, id, accessToken, refreshToken, providerData);
					user.setIdentity(UserModel.USERNAME, availableUserName, null, null, null);
					user.save(function (err) {
						return callback(err, user, true);
					});
				});
			}
			return callback(null, user, false);
		});

	} else {
		currentUser.setIdentity(provider, id, accessToken, refreshToken, providerData);
		return currentUser.save(function (err) {
			return callback(err, currentUser, '/#!/settings/accounts');
		});
	}
};


UserSchema.statics.USERNAME = 'username';
UserSchema.statics.EMAIL = 'email';

UserModel = mongoose.model('User', UserSchema);

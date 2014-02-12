'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		default: '',
		trim: true
	},
	lastName: {
		type: String,
		default: '',
		trim: true
	},
	displayName: {
		type: String,
		default: '',
		trim: true
	},
	email: {
		type: String,
		default: '',
		trim: true,
	},
	username: {
		type: String,
		default: '',
		trim: true,
		unique: true
	},
	provider: {
		type: String,
		required: true
	},
	hashed_password: String,
	salt: String,
	providerData: {}
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashed_password = this.encryptPassword(password);
}).get(function() {
	return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
	return value && value.length;
};

// The below 5 validations only apply if you are signing up traditionally
UserSchema.path('firstName').validate(function(firstName) {
	if (this.provider !== 'local') return true;
	else return firstName.length;
}, 'First name cannot be blank');
UserSchema.path('lastName').validate(function(lastName) {
	if (this.provider !== 'local') return true;
	else return lastName.length;
}, 'Last name cannot be blank');
UserSchema.path('email').validate(function(email) {
	if (this.provider !== 'local') return true;
	else return email.length;
}, 'Email cannot be blank');
UserSchema.path('username').validate(function(username) {
	if (this.provider !== 'local') return true;
	else return username.length;
}, 'Username cannot be blank');
UserSchema.path('hashed_password').validate(function(hashed_password) {
	if (this.provider !== 'local') return true;
	else return hashed_password.length;
}, 'Password cannot be blank');

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
	if (!this.isNew) return next();

	if (!validatePresenceOf(this.password) && this.provider === 'local') next(new Error('Invalid password'));
	else next();
});

/**
 * Methods
 */
UserSchema.methods = {
	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */
	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	/**
	 * Make salt
	 *
	 * @return {String}
	 * @api public
	 */
	makeSalt: function() {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	},

	/**
	 * Encrypt password
	 *
	 * @param {String} password
	 * @return {String}
	 * @api public
	 */
	encryptPassword: function(password) {
		if (!password) return '';
		return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
	}
};

mongoose.model('User', UserSchema);
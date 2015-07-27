'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	validator = require('validator');

/**
 * Email Schema
 */
var EmailSchema = new Schema({
	address: {
		type: String,
		trim: true,
		required: 'Email address is required.',
		unique: true,
		validate: [validator.isEmail, 'Please provide a valid email address']
	},
	isPrimary: {
		type: Boolean,
		default: false
	},
	token: String,
	confirmed: Date,
	updated: Date,
	created: {
		type: Date,
		default: Date.now
	}
}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
});

EmailSchema.virtual('isConfirmed')
	.get(function () {
		return this.confirmed !== undefined;
	});

/**
 * Hook a pre save method to generate a token
 */
EmailSchema.pre('save', function (next) {
	if (this.isModified('address')) {
		this._emailWasUpdated = true;
		delete this.confirmed;
		this.token = crypto.randomBytes(48).toString('hex');
	}

	next();
});

module.exports = {
	Schema: EmailSchema
};

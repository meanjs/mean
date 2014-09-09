'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};
var TrimmedString = {type:String, trim:true};

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
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
    isEmployee: Boolean,
    gender:TrimmedString,
    dateOfBirth:{type:Date, required:'Please fill date of birth'},
    ssn:TrimmedString,
    startDate: Date,
    address: [{
        type: TrimmedString,
        line1: TrimmedString,
        line2:TrimmedString,
        city: TrimmedString,
        zip: TrimmedString,
        state: TrimmedString,
        country: TrimmedString
    }],
    visaStatus : [{
        status: TrimmedString,
        effectiveDate: Date
    }],
    status: [{
        status: TrimmedString,
        effectiveDate: Date
    }],
    phones: [{
        type:TrimmedString,
        number: TrimmedString,
        Ext:TrimmedString
    }],
    emails: [{
        type: TrimmedString,
        email: TrimmedString
    }],
    docs: [{
        type: TrimmedString,
        file: TrimmedString
    }],
    projects: [
        {
            startDate:Date,
            endDate:Date,
            project: {
                type: Schema.ObjectId,
                ref: 'Project'
            }
        }
    ],
    extra:[{
        type:TrimmedString,
        value:TrimmedString
    }],
    /* Timesheet access */
    accessTS:[
        {
            project:{
                type: Schema.ObjectId,
                ref: 'Project'
            },
            user:{
                type: Schema.ObjectId,
                ref: 'User'
            },
            rightToApprove:TrimmedString
        }
    ],

	username: {
		type: String,
		unique: '',
		required: 'Please fill in a username',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin', 'timeAdmin', 'expenseAdmin', 'projectAdmin']
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

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
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

mongoose.model('User', UserSchema);
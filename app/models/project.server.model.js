'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var TrimmedString = {type:String, trim:true};

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	name: { type: String, required: 'Please fill Project name',trim: true},
    client: { type: String, required: 'Please fill Client Name',trim: true},
    location: {
        line1: TrimmedString,
        line2:TrimmedString,
        city: TrimmedString,
        zip: TrimmedString,
        state: TrimmedString,
        country: TrimmedString
    },
    docs: [{
        type: TrimmedString,
        file: TrimmedString
    }],
    vendor: {
        type: Schema.ObjectId,
        ref: 'Vendor'
    },
    created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Project', ProjectSchema);
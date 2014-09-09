'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var TrimmedString = {type:String, trim:true};

/**
 * Timesheet Schema
 */
var TimesheetSchema = new Schema({
	startDate: Date,
    endDate: Date,
    status:TrimmedString,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    project: {
        type: Schema.ObjectId,
        ref: 'Project'
    },
    daily:[
        {
            date:Date,
            hours: Number,
            comment: TrimmedString
        }
    ],
    docs: [{
        type: TrimmedString,
        file: TrimmedString
    }],
    created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Timesheet', TimesheetSchema);
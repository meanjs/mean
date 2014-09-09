'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var TrimmedString = {type:String, trim:true};

/**
 * Expense Schema
 */
var ExpenseSchema = new Schema({
    startDate: Date,
    endDate: Date,
    status:TrimmedString,
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    type: TrimmedString,
    amount: Number,
    project: {
        type: Schema.ObjectId,
        ref: 'Project'
    },
    docs: [{
        type: TrimmedString,
        file: TrimmedString
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Expense', ExpenseSchema);
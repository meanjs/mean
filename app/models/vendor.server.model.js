'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var TrimmedString = {type:String, trim:true};

/**
 * Vendor Schema
 */
var VendorSchema = new Schema({
    name:{type: String, required:'Please fill name', trim:true},
    address: {
        line1: TrimmedString,
        line2:TrimmedString,
        city: TrimmedString,
        zip: TrimmedString,
        state: TrimmedString,
        country: TrimmedString
    },
    emails: [TrimmedString],
    invoiceCycle:TrimmedString,
    weekStartDay:TrimmedString, /* If weekly need to identify Sun/Mon etc*/
    contactPerson:[{
        role:TrimmedString,
        name:TrimmedString,
        email:TrimmedString,
        phone:TrimmedString,
        extra:TrimmedString
    }],
    docs: [{
        type: TrimmedString,
        file: TrimmedString
    }],
    extra:Schema.Types.Mixed,
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Vendor', VendorSchema);
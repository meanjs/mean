'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Option Schema
 */
var OptionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Option name',
    trim: true
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

mongoose.model('Option', OptionSchema);

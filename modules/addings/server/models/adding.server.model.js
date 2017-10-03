'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Adding Schema
 */
var AddingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Adding name',
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

mongoose.model('Adding', AddingSchema);

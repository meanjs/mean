'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customizing Schema
 */
var CustomizingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Customizing name',
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

mongoose.model('Customizing', CustomizingSchema);

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sett ing Schema
 */
var SettIngSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Sett ing name',
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

mongoose.model('SettIng', SettIngSchema);

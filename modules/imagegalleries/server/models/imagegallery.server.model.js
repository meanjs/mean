'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Imagegallery Schema
 */
var ImagegallerySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Image Gallery name',
    trim: true
  },
  paths: {
    type: Array,
    default: '',
    // required: 'Please Select an Image',
    trim: true
  },
  description: {
    type: String,
    default: '',
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

mongoose.model('Imagegallery', ImagegallerySchema);

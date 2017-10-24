'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Module Schema
 */
var ModuleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  textHex: {
    type: String,
    default: '#000000',
    trim: true,
    required: 'Color cannot be blank'
  },
  highlightHex: {
    type: String,
    default: '#ffffff',
    trim: true,
    required: 'Color cannot be blank'
  }
});

ModuleSchema.statics.seed = seed;

mongoose.model('Module', ModuleSchema);
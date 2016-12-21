'use strict';

/**
 * Module dependencies
 */
let mongoose = require('mongoose'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/**
 * Visitor Schema
 */
let VisitorSchema = new Schema({
  companyId: {
    type: String,
    trim: true,
    index: true,
    required: [true, 'companyId property is missing']
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'name property is missing']
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    required: [true, 'email property is missing']
  },
  mobile: {
    type: String,
    trim: true,
    required: [true, 'mobile property is missing']
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Visitor', VisitorSchema);

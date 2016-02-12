'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reply Schema
 */
var ReplySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  edited: {
    type: Date,
    default: null
  },
  article: {
    type: Schema.ObjectId,
    ref: 'Article'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  replies: [{
    type: Schema.ObjectId,
    ref: 'Reply'
  }],
  nestedLevel: {
    type: Number,
    default: 1
  },
  replyTo: {
    type: Schema.ObjectId,
    ref: 'Reply'
  }
}, { collection : 'replies' });

mongoose.model('Reply', ReplySchema);

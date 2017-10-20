'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Recipedetail Schema
 */
var RecipedetailSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Recipedetail name',
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

mongoose.model('Recipedetail', RecipedetailSchema);

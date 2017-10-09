'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Recipe = mongoose.model('Recipe'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Recipe
 */
exports.create = function(req, res) {
  var recipe = new Recipe(req.body);
  recipe.user = req.user;

  recipe.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recipe);
    }
  });
};

/**
 * Show the current Recipe
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var recipe = req.recipe ? req.recipe.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  recipe.isCurrentUserOwner = req.user && recipe.user && recipe.user._id.toString() === req.user._id.toString();

  res.jsonp(recipe);
};

/**
 * Update a Recipe
 */
exports.update = function(req, res) {
  var recipe = req.recipe;

  recipe = _.extend(recipe, req.body);

  recipe.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recipe);
    }
  });
};

/**
 * Delete an Recipe
 */
exports.delete = function(req, res) {
  var recipe = req.recipe;

  recipe.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recipe);
    }
  });
};

/**
 * List of Recipes
 */
exports.list = function(req, res) {
  Recipe.find().sort('-created').populate('user', 'displayName').exec(function(err, recipes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(recipes);
    }
  });
};

/**
 * Recipe middleware
 */
exports.recipeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Recipe is invalid'
    });
  }

  Recipe.findById(id).populate('user', 'displayName').exec(function (err, recipe) {
    if (err) {
      return next(err);
    } else if (!recipe) {
      return res.status(404).send({
        message: 'No Recipe with that identifier has been found'
      });
    }
    req.recipe = recipe;
    next();
  });
};

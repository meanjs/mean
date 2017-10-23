'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Item = mongoose.model('Item'),
  Category = mongoose.model('Category'),
  Module = mongoose.model('Module'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.listAllCategories = function(req, res) {
  Category.find().sort('-title').exec(function (err, categories) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categories);
    }
  });
};

exports.createCategory = function (req, res) {
  var category = new Category(req.body);
  category.user = req.user;

  category.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

exports.deleteCategory = function(req, res) {
  var toDelete = req.body;
  Category.findOneAndRemove({'title' : toDelete.title}, function(err, deleted) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(deleted);
  });
 };


exports.listAllModules = function(req, res) {
  Module.find().sort('-title').exec(function (err, modules) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modules);
    }
  });
};

exports.createModule = function (req, res) {
  var module = new Module(req.body);
  module.user = req.user;

  module.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(module);
    }
  });
};


exports.deleteModule = function(req, res) {
  var toDelete = req.body;
  Module.findOneAndRemove({'title' : toDelete.title}, function(err, deleted) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(deleted);
  });
 };

/**
 * Create an item
 */
exports.create = function (req, res) {
  var item = new Item(req.body);
  item.user = req.user;

  item.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * Show the current item
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var item = req.item ? req.item.toJSON() : {};

  // Add a custom field to the Item, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Item model.
  item.isCurrentUserOwner = !!(req.user && item.user && item.user._id.toString() === req.user._id.toString());

  res.json(item);
};

/**
 * Update an item
 */
exports.update = function (req, res) {
  var item = req.item;

  item.title = req.body.title;
  item.content = req.body.content;

  item.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * Delete an item
 */
exports.delete = function (req, res) {
  var item = req.item;

  item.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * List of Items
 */
exports.list = function (req, res) {
  Item.find().sort('-created').populate('user', 'displayName').exec(function (err, items) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(items);
    }
  });
};

/**
 * Item middleware
 */
exports.itemByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Item is invalid'
    });
  }

  Item.findById(id).populate('user', 'displayName').exec(function (err, item) {
    if (err) {
      return next(err);
    } else if (!item) {
      return res.status(404).send({
        message: 'No item with that identifier has been found'
      });
    }
    req.item = item;
    next();
  });
};

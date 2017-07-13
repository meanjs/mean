'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  _ = require('lodash'),
  chalk = require('chalk'),
  path = require('path'),
  mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = function (callback) {
  // Globbing model files
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });

  if (callback) callback();
};

// Initialize Mongoose
module.exports.connect = function (callback) {
  var _this = this;

  // Use configured promises library
  mongoose.Promise = config.db.promise;

  // Enabling mongoose debug mode if required
  mongoose.set('debug', Boolean(config.db.debug));

  // Ensure `useMongoClient` is set to `true` in options
  // http://mongoosejs.com/docs/connections.html#use-mongo-client
  var options = _.merge(config.db.options || {}, { useMongoClient: true });

  // Connect to MongoDB
  mongoose.connect(config.db.uri, options);

  // Log connection errors
  mongoose.connection.on('error', console.error.bind(console, 'Mongoose connection error:'));

  // When connection is open, do callback with Promise
  mongoose.connection.once('open', function () {
    console.log(chalk.green('Connected to MongoDB.'));
    if (callback) callback(mongoose.connection.db);
  });
};

// Disconnect Mongoose
module.exports.disconnect = function (callback) {
  mongoose.disconnect().then(function () {
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    if (callback) callback();
  }).catch(function (err) {
    console.error(err);
    if (callback) callback(err);
  });
};

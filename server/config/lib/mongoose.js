'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  chalk = require('chalk'),
  path = require('path'),
  mongoose = require('mongoose'),
  seed = require('./seed');

/**
 * Load all mongoose related models
 */
module.exports.loadModels = function() {
  return new Promise(function (resolve, reject) {
    // Globbing model files
    config.files.server.mongooseModels.forEach(function (modelPath) {
      require(path.resolve(modelPath));
    });

    resolve();
  });
}

/**
 * seed the database with default data
 * @param {object} dbConnection the mongoose connection
 */
module.exports.seed = function(dbConnection) {
  return new Promise(function (resolve, reject) {
    if (config.seedDB && config.seedDB.seed) {
      console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
      seed.start().then(function() {
        resolve(dbConnection);
      });
    } else {
      resolve(dbConnection);
    }
  });
}

/**
 * Connect to the MongoDB server
 */
module.exports.connect = function() {
  return new Promise(function (resolve, reject) {

    // Attach Node.js native Promises library implementation to Mongoose
    mongoose.Promise = config.db.promise;

    mongoose.connect(config.db.uri, config.db.options)
      .then(function() {

        // Enabling mongoose debug mode if required
        mongoose.set('debug', config.db.debug);

        // Resolve a successful connection with the mongoose object for the
        // default connection handler
        resolve(mongoose);
      })
      .catch(function(err) {
        // Log Error
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(err);
        reject(err);
      })
  });
}

/**
 * Disconnect from the MongoDB server
 */
module.exports.disconnect = function () {
  return new Promise(function (resolve, reject) {
    mongoose.disconnect(function (err) {
      console.info(chalk.yellow('Disconnected from MongoDB.'));
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

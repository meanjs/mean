/**
 * Module dependencies.
 */
const _ = require('lodash');

const config = require('../config');
const chalk = require('chalk');
const path = require('path');
const mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = callback => {
  // Globbing model files
  config.files.server.models.forEach(modelPath => {
    require(path.resolve(modelPath));
  });

  if (callback) callback();
};

// Initialize Mongoose
module.exports.connect = callback => {
  mongoose.Promise = config.db.promise;

  const options = _.merge(config.db.options || {}, { useMongoClient: true });

  mongoose
    .connect(config.db.uri, options)
    .then(connection => {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.db.debug);

      // Call callback FN
      if (callback) callback(connection.db);
    })
    .catch(err => {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    });

};

module.exports.disconnect = cb => {
  mongoose.connection.db
    .close(err => {
      console.info(chalk.yellow('Disconnected from MongoDB.'));
      return cb(err);
    });
};

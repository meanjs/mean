'use strict';

var _ = require('lodash'),
  config = require('../config'),
  mongoose = require('mongoose'),
  chalk = require('chalk');

var seedConfig = _.clone(config.seedDB, true) || {};

exports.start = start;

function start(config) {
  return new Promise(function (resolve, reject) {

    seedConfig.options = _.merge(_.clone(seedConfig.options, true), config ? config.options : {});

    if (config && config.collections) {
      seedConfig.collections = config.collections;
    }

    const collections = seedConfig.collections || [];

    if (!collections.length) {
      return resolve();
    }

    var seeds = collections
      .filter(function (collection) {
        return collection.model;
      })
      .map(seed);

    Promise.all(seeds)
      .then(function () {
        if (seedConfig.options.logResults) {
          console.log();
          console.log(chalk.bold.green('Database Seeding: Mongo Seed complete!'));
          console.log();
        }

        return resolve();
      })
      .catch(function (err) {
        if (seedConfig.options.logResults) {
          console.log();
          console.log(chalk.bold.red('Database Seeding: Mongo Seed Failed!'));
          console.log(chalk.bold.red('Database Seeding: ' + err));
          console.log();
        }

        return reject(err);
      });
  });
}

function seed(collection) {
  return new Promise(function (resolve, reject) {
    const Model = mongoose.model(collection.model);
    const docs = collection.docs;

    // Merge global options with collection options
    var options = _.merge(_.clone(seedConfig.options, true), collection.options || {});
    var skipWhen = collection.skip ? collection.skip.when : null;

    if (!Model.seed) {
      return reject(new Error('Database Seeding: Invalid Model Configuration - ' + collection.model + '.seed() not implemented'));
    }

    if (!docs || !docs.length) {
      return resolve();
    }

    // First check if we should skip this collection
    // based on the collection's "skip.when" option.
    // NOTE: If it exists, "skip.when" should be a qualified
    // Mongoose query that will be used with Model.find().
    skipCollection()
      .then(seedDocuments)
      .then(function () {
        return resolve();
      })
      .catch(function (err) {
        return reject(err);
      });

    function skipCollection() {
      return new Promise(function (resolve, reject) {
        if (!skipWhen) {
          return resolve(false);
        }

        Model
          .find(skipWhen)
          .exec(function (err, results) {
            if (err) {
              return reject(err);
            }

            if (results && results.length) {
              return resolve(true);
            }

            return resolve(false);
          });
      });
    }

    function seedDocuments(skipCollection) {
      return new Promise(function (resolve, reject) {

        if (skipCollection) {
          return onComplete([{ message: chalk.yellow('Database Seeding: ' + collection.model + ' collection skipped') }]);
        }

        var workload = docs
          .filter(function (doc) {
            return doc.data;
          })
          .map(function (doc) {
            return Model.seed(doc.data, { overwrite: doc.overwrite });
          });

        Promise.all(workload)
          .then(onComplete)
          .catch(onError);

        // Local Closures

        function onComplete(responses) {
          if (options.logResults) {
            responses.forEach(function (response) {
              if (response.message) {
                console.log(chalk.magenta(response.message));
              }
            });
          }

          return resolve();
        }

        function onError(err) {
          return reject(err);
        }
      });
    }
  });
}

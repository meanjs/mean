'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk');

// Establish an SQL server connection, instantiating all models and schemas
function startSequelize() {
  return new Promise(function (resolve, reject) {
    let orm = null;
    if (config.orm) {
      orm = require('./sequelize');
      orm.sync()
        .then(function () {
          resolve(orm);
        });
    }
  });
}

// Establish a MongoDB connection, instantiating all models
function startMongoose() {
  return new Promise(function (resolve, reject) {
    mongoose.loadModels()
      .then(mongoose.connect)
      .then(mongoose.seed)
      .then(function(dbConnection) {
        resolve(dbConnection);
      })
  });
}

/**
 * Establish ExpressJS powered web server
 * @param {object} db a Mongoose DB
 * @param {object} orm an SQL DB
 */
function startExpress(db, orm) {
  return new Promise(function (resolve, reject) {
    // Initialize the ExpressJS web application server
    const app = express.init(db, orm);
    resolve(app);
  })
}


/**
 * Bootstrap the required services
 * @returns {Object} db, orm, and app instances
 */
function bootstrap () {
  return new Promise(async function (resolve, reject) {
    const orm = await startSequelize();
    const db = await startMongoose();
    const app = await startExpress(db, orm);

    resolve({
      db: db,
      orm: orm,
      app: app
    });

  });
};


// Expose the boostrap function publically
exports.bootstrap = bootstrap;

// Boot up the server
exports.start = function start() {
  return new Promise(async function (resolve, reject) {

    const { db, orm, app } = await bootstrap();

    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server URL
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
      console.log(chalk.green('Server:          ' + server));
      console.log(chalk.green('Database:        ' + config.db.uri));
      console.log(chalk.green('App version:     ' + config.meanjs.version));

      if (config.meanjs['meanjs-version']) {
        console.log(chalk.green('MEAN.JS version: ' + config.meanjs['meanjs-version']));
      }

      console.log('--');

      resolve({
        db: db,
        orm: orm,
        app: app
      });

    });

  });
};

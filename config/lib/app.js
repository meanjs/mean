'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk'),
  seed = require('./seed');

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on')); //eslint-disable-line
    seed.start();
  }
}

// Initialize Models
mongoose.loadModels(seedDB);

module.exports.loadModels = function loadModels() {
  mongoose.loadModels();
};

module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config);

  });
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, db, config) {

    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server URL
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      console.log('--'); //eslint-disable-line
      console.log(chalk.green(config.app.title)); //eslint-disable-line
      console.log(); //eslint-disable-line
      console.log(chalk.green('Environment:     ' + process.env.NODE_ENV)); //eslint-disable-line
      console.log(chalk.green('Server:          ' + server)); //eslint-disable-line
      console.log(chalk.green('Database:        ' + config.db.uri)); //eslint-disable-line
      console.log(chalk.green('App version:     ' + config.meanjs.version)); //eslint-disable-line
      if (config.meanjs['meanjs-version'])
        console.log(chalk.green('MEAN.JS version: ' + config.meanjs['meanjs-version'])); //eslint-disable-line
      console.log('--'); //eslint-disable-line 

      if (callback) callback(app, db, config);
    });

  });

};

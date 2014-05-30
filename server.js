'use strict';
/**
 * Module dependencies.
 */
var MEAN = require('mean-core');
var admin = require('mean-admin');

// Init App
var application = new MEAN();
var expressApplication = application.listen();

// Attach admin
admin(expressApplication);

<<<<<<< HEAD
// Expose App
exports = module.exports = expressApplication;
=======
// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
>>>>>>> 0.3.2

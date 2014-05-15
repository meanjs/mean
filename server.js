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

// Expose App
exports = module.exports = expressApplication;

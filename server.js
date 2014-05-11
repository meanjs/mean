'use strict';
/**
 * Module dependencies.
 */
var MEAN = require('mean-core');

// Init App
var application = new MEAN();

// Expose App
exports = module.exports = application.listen();

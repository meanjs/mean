'use strict';

/**
 * Module dependencies.
 */
var app, db, config;

var path = require('path');
var app = require(path.resolve('./config/lib/app'));

app.init(function (app, db, config) {
	console.log('Initialized test automation');
});

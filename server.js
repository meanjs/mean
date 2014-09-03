'use strict';
/**
 * Module dependencies.
 */
var init = require('./app/config/init')(),
	config = require('./app/config/config'),
	mongoose = require('mongoose');

// config for log4js only needs to happen once
// any other time it is required in  other files, use:
// var log4js = require(log4js)
//can be done
var log4js = require('./app/config/logging')(config.log4js);
var logger = log4js.getLogger('server');
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});

// Init the express application
var app = require('./app/config/express')(db);

// Bootstrap passport config
require('./app/config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
logger.info('MEAN.JS application started on port ' + config.port);

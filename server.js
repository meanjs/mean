'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	cluster = require('cluster'),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();


if (cluster.isMaster) {
	var debug = process.execArgv.indexOf('--debug') !== -1;
	cluster.setupMaster({
		execArgv: process.execArgv.filter(function(s) { return s !== '--debug'; })
	});

	cluster.on('exit', function(worker, code, signal) {
		console.dir(arguments);
		cluster.fork();
	});

	console.log('MEAN.JS application starting on port ' + config.port);
	for (var i = 0; i < config.workers; ++i) {
		if (debug) {
			cluster.settings.execArgv.push('--debug=' + (5859 + i));
			cluster.fork();
			cluster.settings.execArgv.pop();
		}
		else {
			cluster.fork();
		}
	}
}
else {
	// Start the app by listening on <port>
	app.listen(config.port);

	console.log('MEAN.JS Worker #' + cluster.worker.id + ' started');
	// Expose app
	exports = module.exports = app;
}

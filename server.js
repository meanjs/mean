'use strict';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
	mongoose = require('./config/lib/mongoose'),
	express = require('./config/lib/express'),
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initialize mongoose
mongoose.connect(function (db) {
	// Initialize express
	var app = express.init(db);

	// Start the app by listening on <port>
	app.listen(config.port);

	// Logging initialization
	console.log('--');
	console.log(chalk.green(config.app.title + ' application started'));
	console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
	console.log(chalk.green('Port:\t\t\t\t' + config.port));
	console.log(chalk.green('Database:\t\t\t' + config.db.uri));
	if (process.env.NODE_ENV === 'secure') {
		console.log(chalk.green('HTTPs:\t\t\t\ton'));
	}
	console.log('--');
});
'use strict';

/**
 * Module dependencies.
 */
var glob = require('glob'),
	chalk = require('chalk');

/**
 * Module init function.
 */
module.exports = function() {
	/**
	 * Before we begin, lets set the environment variable
	 * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
	 */
	glob('./config/env/' + process.env.NODE_ENV + '.js', {
		sync: true
	}, function(err, environmentFiles) {
		if (!environmentFiles.length) {
			if (process.env.NODE_ENV) {
				console.error(chalk.red('No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
			} else {
				console.error(chalk.red('NODE_ENV is not defined! Using default development environment'));
			}

			process.env.NODE_ENV = 'development';
		}

		// Initialize a single instance of Elastic Search if it is configured, accessible through global.es
		var config = require('./config');
		if (config.elasticsearch)
		{
			// We are only allowed to initialize a single instance of ES so we are doing this here,
			// see http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current/configuration.html#_config_options
			global.es = new require('elasticsearch').elasticsearch.Client(config.elasticsearch);
		}
	});

};
'use strict';

/**
 * Module dependencies.
 */

var morgan = require('morgan');
var config = require('./config');
var fs = require('fs');

/**
 * Module init function.
 */
module.exports = {

	getLogFormat: function() {
		return config.log.format;
	},

	getLogOptions: function() {
		var options = {};

		try {
			if ('stream' in config.log.options) {
				options = {
					stream: fs.createWriteStream(process.cwd() + '/' + config.log.options.stream, {flags: 'a'})
				};
			}
		} catch (e) {
			options = {};
		}

		return options;
	}

};
'use strict';

/**
 * Module dependencies.
 */
var utilities = require('./config/utilities');

// Grabbing module files using the walk function
var modulesJSFiles = utilities.walk('./public/modules', /(.*)\.(js)/, null, null);

// Karma configuration
module.exports = function(config) {
	config.set({
		// Frameworks to use
		frameworks: ['jasmine'],

		// List of files / patterns to load in the browser
		files: [
			'public/lib/angular/angular.js',
			'public/lib/angular-animate/angular-animate.js',
			'public/lib/angular-mocks/angular-mocks.js',
			'public/lib/angular-cookies/angular-cookies.js',
			'public/lib/angular-resource/angular-resource.js',
			'public/lib/angular-route/angular-route.js',
			'public/lib/angular-bootstrap/ui-bootstrap.js',
			'public/lib/angular-ui-utils/ui-utils.js',
			'public/js/config.js',
			'public/js/application.js',
		].concat(modulesJSFiles),

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		//reporters: ['progress'],
		reporters: ['progress'],

		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true
	});
};
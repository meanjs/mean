'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(this.applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: 'mean',
		applicationName: 'MEAN.JS',
		applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils'],
		registerModule: registerModule
	};
})();

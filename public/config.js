'use strict';

// Init the application configuration object for AngularJS application
var ApplicationConfiguration = (function() {
	return {
		applicationModuleName: 'mean',
		applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils'],
		registerModule: function(moduleName) {
			// Create angular module
			angular.module(moduleName, []);

			// Add the module to the AngularJS configuration file
			angular.module(this.applicationModuleName).requires.push(moduleName);
		}
	};
})();
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	glob = require('glob');

/**
 * Load app configurations
 */
module.exports =  _.extend(
	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}
);

/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			glob(globPatterns, {
				sync: true
			}, function(err, files) {
				if (removeRoot) {
					files = files.map(function(file) {
						return file.replace(removeRoot, '');
					});
				}

				output = _.union(output, files);
			});
		}
	}

	return output;
};

/**
 * Get the modules JavaScript files
 */
module.exports.getJavaScriptAssets = function(includeTests) {
	var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');

	// To include tests
	if (includeTests) {
		output = _.union(output, this.getTestAssets());
	}

	return output;
};

module.exports.getTestAssets = function(removeRoot) {
  var output = this.getGlobbedFiles(this.assets.tests, removeRoot);
  return output;
};

/**
 * Get the modules CSS files
 */
module.exports.getCSSAssets = function() {
	var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
	return output;
};

module.exports.configurationChecks = function() {
  /*
    Check to determine if there are libraries in the public folder that are not included in the configuration files
   */
  if (!process.env.DISABLE_PUBLIC_LIB_CHECK && process.env.NODE_ENV !== 'production') {
    var configJsAssets = this.getJavaScriptAssets(),
        configCssAssets = this.getCSSAssets(),
        configTestsAssets = this.getTestAssets('public/');
    var allConfigAssets = _.union(configJsAssets, configCssAssets, configTestsAssets);
    
    // Get all the assets that have been loaded from NPM
    var assetPathPresentInProject = this.getGlobbedFiles('./public/lib/*', './public/');
    
    console.info('\x1b[30m\x1b[47m');
    console.info('----------------\n Checking that NPM packages are added to project configuration...\n----------------');
    assetPathPresentInProject.forEach(function(assetPath) {
      var curPathRegEx = new RegExp('^' + assetPath + '/[a-zA-Z.]*');
      var found = _.any(allConfigAssets, function(configAsset) {
        return curPathRegEx.test(configAsset);
      });
      if (found) {
        console.info('\x1b[34m', '   FOUND - ' + assetPath + ' is in the "all.js" project configuration');
      } else {
        console.info('\x1b[31m', '* NOT FOUND - ' + assetPath + ' is NOT in the "all.js" project configuration');
      }
    });
    console.info('\n\x1b[30mAdd missing libs to your configuration to avoid errors');
    console.info('To disable this check, set env var DISABLE_PUBLIC_LIB_CHECK');
    console.info('\x1b[0m\n');
  }
};
'use strict';

var _ = require('lodash'),
    glob = require('glob');

/**
 * Before we begin, lets set the envrionment variable
 * We'll Look for a valid NODE_ENV variable and if one cannot be found load the development NODE_ENV
 */
glob('./config/env/' + process.env.NODE_ENV + '.js', {
    sync: true
}, function(err, environmentFiles) {
    process.env.NODE_ENV = environmentFiles.length ? process.env.NODE_ENV : 'development';
});

// Load app configurations
module.exports = _.extend(
    require('./env/all'),
    require('./env/' + process.env.NODE_ENV) || {}
);

/**
 * Get the modules JavaScript files
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
    // For context switching
    var _this = this;

    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

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
        output = _.union(output, this.getGlobbedFiles(this.assets.tests));
    }

    return output;
};

/**
 * Get the modules CSS files
 */
module.exports.getCSSAssets = function() {
    var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
    return output;
};
'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');

// Walk function to recursively get files
var _walk = function(root, regex, exclude, removePath) {
	var output = [];
	var directories = [];

	// First read through files 
	fs.readdirSync(root).forEach(function(file) {
		var newPath = root + '/' + file;
		var stat = fs.statSync(newPath);

		if (stat.isFile()) {
			if (regex.test(file) && (!exclude || !exclude.test(file))) {
				output.push(newPath.replace(removePath, ''));
			}
		} else if (stat.isDirectory()) {
			directories.push(newPath);
		}
	});

	// Then recursively add directories
	directories.forEach(function(directory) {
		output = output.concat(_walk(directory, regex, exclude, removePath));
	});

	return output;
};

/**
 * Exposing the walk function
 */
exports.walk = _walk;
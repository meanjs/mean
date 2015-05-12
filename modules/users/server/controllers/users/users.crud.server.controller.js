'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.users = function (req, res) {
	User.find({}, function (error, users) {
		res.json(users || null);
	});
};

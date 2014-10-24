'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./users/users.authentication.server.controller.js'),
	require('./users/users.authorization.server.controller.js'),
	require('./users/users.password.server.controller.js'),
	require('./users/users.profile.server.controller.js')
);
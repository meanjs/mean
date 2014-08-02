'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./users/users.authentication'),
	require('./users/users.authorization'),
	require('./users/users.password'),
	require('./users/users.profile')
);
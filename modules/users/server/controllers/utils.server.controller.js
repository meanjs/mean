// by bwin on 6/11/15.

'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend game's controller
 */
module.exports = _.extend(
    require('./utils/common.server.controller'),
    require('./utils/socket.server.controller')
);

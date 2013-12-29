'use strict';

var _ = require('lodash');

//Load app configuration
module.exports = _.merge(require(__dirname + '/../config/env/all.js'), require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {});
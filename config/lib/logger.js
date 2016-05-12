'use strict';

var _ = require('lodash'),
  config = require('../config'),
  chalk = require('chalk'),
  fs = require('fs'),
  winston = require('winston');

// list of valid formats for the logging
var validFormats = ['combined', 'common', 'dev', 'short', 'tiny'];

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      colorize: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    }),
    new winston.transports.File({
      level: 'debug',
      colorize: false,
      filename: 'app.log',
      timestamp: true,
      maxsize: 10485760,
      maxFiles: 2,
      json: true,
      eol: '\n',
      tailable: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ],
  exitOnError: false
});

module.exports = logger;

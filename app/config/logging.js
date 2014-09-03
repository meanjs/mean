'use strict';

var log4js = require('log4js');
var fs = require('fs');

module.exports = function(log4jsConfig){
  log4js.configure(log4jsConfig.config);
  return log4js;
};

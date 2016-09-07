'use strict';

module.exports.addJSONStringifyHelper = function (hbs) {
  hbs.registerHelper('json', function(obj) {
    return JSON.stringify(obj);
  });
};

/**
 * Set return configured handlebars
 */
module.exports.initHbs = function () {
  var handlebars = require('express-hbs');

  // add helper for JSON
  this.addJSONStringifyHelper(handlebars);

  return handlebars;
};

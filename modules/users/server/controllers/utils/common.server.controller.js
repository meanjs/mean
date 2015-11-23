// by bwin on 6/11/15.

'use strict';


var _ = require('lodash');

//
exports.get_id = function (model) {
  var id = model._id || model;
  return id.toString();
};

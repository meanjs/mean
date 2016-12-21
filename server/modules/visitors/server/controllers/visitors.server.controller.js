'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Visitor = mongoose.model('Visitor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Get a list of all visitors
 */
exports.getVisitors = function (req, res) {

  let companyId = '1';

  Visitor.
    find({
      companyId: companyId
    }).
    limit(100).
    sort({ created: -1 }) .
    exec(function(err, results) {
      if (err) {
        res.status(500).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).send({
        visitors: results
      });

    });

};


/**
 * Create new Visitor entry
 */
exports.newVisitor = function (req, res) {
};

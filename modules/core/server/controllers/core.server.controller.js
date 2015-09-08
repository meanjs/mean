'use strict';

var fs = require('fs'),
  path = require('path'),
  async = require('async');

function readViewFromDisk (viewPath, callback) {
  var splittedPath = viewPath.split('/');
  var viewName = splittedPath[splittedPath.length-1].split('.')[0];
  fs.readFile(path.resolve(viewPath), 'utf8', function (err, file) {
    if(err) {
      callback(err);
    } else {
      callback(null, {
        name: viewName,
        file: file
      });
    }
  });
}

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  async.concat(res.app.locals.htmlFiles, readViewFromDisk, function (err, embeddableViews) {
    res.locals.htmlFiles = embeddableViews;
    res.render('modules/core/server/views/index', {
      user: req.user || null
    });
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

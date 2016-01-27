'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller'),
  passport = require('passport'),
  express = require('express');

module.exports = function (app) {
  var router = express.Router();
  
  router.route('/')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  router.route('/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  router.param('userId', admin.userByID);

  app.use('/api/admin/users', router);

};

'use strict';

module.exports = function (app) {
  var users = require('../controllers/catalog.server.controller');

  app.route('/api/catalog/students').get(users.students);

  app.param('studentId', users.studentByID);
};

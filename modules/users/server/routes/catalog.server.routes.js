'use strict';

module.exports = function (app) {
  var users = require('../controllers/catalog.server.controller');

  app.route('/api/catalog/sponsors').get(users.sponsors);
  app.route('/api/catalog/students').get(users.students);
  app.route('/api/catalog/student').get(users.read);

  app.param('studentId', users.studentByID);
};

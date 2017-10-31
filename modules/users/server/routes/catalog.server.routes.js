'use strict';

module.exports = function (app) {
  var users = require('../controllers/catalog.server.controller');

  app.route('/catalog/catalog.json').get(users.list)
  .put(users.update)
  .delete(users.delete);

  app.param('studentId', users.studentByID);
};

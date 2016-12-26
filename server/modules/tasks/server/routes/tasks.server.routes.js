'use strict';

module.exports = function (app) {
  // Tasks controller
  var tasks = require('../controllers/tasks.server.controller');

  // Setting up the models APIs profile api
  app.route('/api/tasks').get(tasks.getAllTasks);
  app.route('/api/tasks/me').get(tasks.validateSessionUser, tasks.getMyTasks);
  app.route('/api/tasks').post(tasks.validateSessionUser, tasks.addTask);

};

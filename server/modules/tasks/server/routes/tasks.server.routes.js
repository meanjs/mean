'use strict';

module.exports = function (app) {
  // Tasks controller
  var tasks = require('../controllers/tasks.server.controller');

  // Setting up the models APIs profile api
  // Query actions
  app.route('/api/tasks').get(tasks.getAllTasks);
  app.route('/api/tasks/me').get(tasks.validateSessionUser, tasks.getMyTasks);

  // CRUD actions
  app.route('/api/tasks').post(tasks.validateSessionUser, tasks.addTask);
  app.route('/api/tasks').put(tasks.validateSessionUser, tasks.updateTask);
  app.route('/api/tasks').delete(tasks.validateSessionUser, tasks.deleteTask);


};

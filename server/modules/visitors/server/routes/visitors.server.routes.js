'use strict';

module.exports = function (app) {

  let visitors = require('../controllers/visitors.server.controller');

  app.route('/api/visitors').get(visitors.getVisitors);
  app.route('/api/visitors').post(visitors.newVisitor);

};

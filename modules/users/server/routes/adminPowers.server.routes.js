'use strict';

module.exports = function (app) {
  var adminPowers = require('../controllers/adminPowers.server.controller');

  app.route('/api/admin/updateUser/:userId').put(adminPowers.updateUser);
  app.route('/api/admin/deleteUser/:userId').delete(adminPowers.deleteUser);

  app.param('userId', adminPowers.participantByID);
};

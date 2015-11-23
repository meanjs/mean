// by bwin on 10/9/15.

'use strict';
var utils = require('../utils.server.controller');

exports.notify = function (req, notification_user, notification_name, notification_obj) {
  var socketio = req.app.get('socketio');
  console.log('NOTIFICATION: ' + notification_name, utils.get_id(notification_user));
  socketio.sockets.in(utils.get_id(notification_user)).emit(notification_name, notification_obj);
};
exports.notify_all = function (req, notification_name, notification_obj) {
  var socketio = req.app.get('socketio');
  socketio.emit(notification_name, notification_obj);
};

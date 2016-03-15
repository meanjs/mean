(function (app) {
  'use strict';

  app.registerModule('users');
  app.registerModule('users.admin');
  app.registerModule('users.services');
  app.registerModule('users.admin.services');
  app.registerModule('users.routes', ['ui.router']);
  app.registerModule('users.admin.routes', ['ui.router', 'users.admin.services']);
}(ApplicationConfiguration));

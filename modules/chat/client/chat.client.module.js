(function (app) {
  'use strict';

  app.registerModule('chat');
  app.registerModule('chat.routes', ['ui.router']);
})(ApplicationConfiguration);

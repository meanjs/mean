((app => {
  'use strict';

  app.registerModule('articles', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('articles.admin', ['core.admin']);
  app.registerModule('articles.admin.routes', ['core.admin.routes']);
  app.registerModule('articles.services');
  app.registerModule('articles.routes', ['ui.router', 'core.routes', 'articles.services']);
})(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('articles');
  app.registerModule('articles.models');
  app.registerModule('articles.routes', ['ui.router', 'articles.models']);
})(ApplicationConfiguration);

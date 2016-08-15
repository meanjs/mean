var config = require('../config'),
  i18n = require('i18n');

i18n.configure({
  locales: Object.keys(config.app.languages),
  directory: config.app.languagesDir,
  defaultLocale: config.app.language,
  queryParameter: 'lang',
  cookie: 'language',
  autoReload: true,
  syncFiles: true
});

module.exports = i18n;

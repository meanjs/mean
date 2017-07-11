'use strict';

// Protractor configuration
var config = {
  specs: ['modules/*/tests/e2e/*.js']
};

if (process.env.TRAVIS) {
  config.capabilities = {
    // Without this setting, Travis CI would default
    // to using Chrome anyway.
    // NOTE: Firefox is currently not working with
    // the Travis CI builds. For more info see:
    // https://github.com/meanjs/mean/pull/1805
    browserName: 'chrome'
  };
}

exports.config = config;

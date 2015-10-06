'use strict';

// Protractor configuration
exports.config = {
  capabilities: {
    'browserName': 'firefox'
  },
  specs: ['modules/*/tests/e2e/*.js']
};

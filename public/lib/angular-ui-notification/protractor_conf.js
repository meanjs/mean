// An example configuration file.
exports.config = {
  allScriptsTimeout: 99999,
  // Do not start a Selenium Standalone sever - only run this using chrome.
  //directConnect: true,
  //chromeDriver: './node_modules/protractor/selenium/chromedriver',

  seleniumArgs: ['-browserTimeout=60'],

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'firefox'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['test/e2e/**/*.spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
  }
};

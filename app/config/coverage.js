'use strict';

var im = require('istanbul-middleware'),
    isCoverageEnabled = (process.env.COVERAGE === 'true');


module.exports = function(){
  isCoverageEnabled = true;
  var rootDir = __dirname.replace('/app/config', '');
  if (isCoverageEnabled) {
    console.log('Hook loader for coverage - ensure this is not production!');
    im.hookLoader(rootDir );
        // cover all files except under node_modules
        // see API for other options
  }
  var meta = {
    isCoverageEnabled: isCoverageEnabled,
    rootDir: rootDir
  };
  return meta;
};

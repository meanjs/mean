/**
 * Module dependencies.
 */

const path = require('path');
const app = require(path.resolve('./config/lib/app'));

app.init(() => {
  console.log('Initialized test automation');
});

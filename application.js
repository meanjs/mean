'use strict';

/**
 * First we set the node enviornment variable if not set before
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Module dependencies.
 */
var	config = require('./config/config'),
    mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
//Bootstrap db connection
var db = mongoose.connect(config.db);

//Init the express application
var app = require('./config/express')(db);

//Bootstrap passport config
require('./config/passport')();

//Bootstrap routes config
require('./config/routes')(app);

//Start the app by listening on <port>
app.listen(config.port);

//Expose app
exports = module.exports = app;

//Logging initialization
console.log('Express app started on port ' + config.port);

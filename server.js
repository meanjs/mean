'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
//var db = mongoose.connect('mongodb://cce:cce@ds039860.mongolab.com:39860/meandb', function(err) {
//    if (err) {
//        console.error('\x1b[31m', 'Could not connect to MongoLabDB!');
//        console.log(err);
//    }
//});
//var db = mongoose.connect('mongodb://cliffeby:stanx2@ds039860.mongolab.com:39860/meandb', function(err) {
//    if (err) {
//        console.error('\x1b[31m', 'Could not connect to MongoLabDB!');
//        console.log(err);
//    }
//});
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});


// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);
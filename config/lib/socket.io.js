'use strict';

// Load the module dependencies
var config = require('../config'),
	path = require('path'),
    cookieParser = require('cookie-parser'),
    passport = require('passport'),
    socketio = require('socket.io'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
    http = require('http');

// Define the Socket.io configuration method
module.exports = function(app, db) {
	// Create a new HTTP server
    var server = http.createServer(app);

    // Create a new Socket.io server
    var io = socketio.listen(server);

    // Create a MongoDB storage object
    var mongoStore = new MongoStore({
        mongooseConnection: db.connection,
        collection: config.sessionCollection
    });

    // Intercept Socket.io's handshake request
    io.use(function(socket, next) {
        // Use the 'cookie-parser' module to parse the request cookies
        cookieParser(config.sessionSecret)(socket.request, {}, function(err) {
            // Get the session id from the request cookies
            var sessionId = socket.request.signedCookies['connect.sid'];

            // Use the mongoStorage instance to get the Express session information
            mongoStore.get(sessionId, function(err, session) {
                // Set the Socket.io session information
                socket.request.session = session;

                // Use Passport to populate the user details
                passport.initialize()(socket.request, {}, function() {
                    passport.session()(socket.request, {}, function() {
                        if (socket.request.user) {
                            next(null, true);
                        } else {
                            next(new Error('User is not authenticated'), false);
                        }
                    });
                });
            });
        });
    });

    // Add an event listener to the 'connection' event
    io.on('connection', function(socket) {
        config.files.server.sockets.forEach(function(socketConfiguration) {
            require(path.resolve(socketConfiguration))(io, socket);
        });
    });

    return server;
};

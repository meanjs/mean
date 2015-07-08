'use strict';

// Create the chat configuration
module.exports = function(io, socket) {
	// Emit the status event when a new socket client is connected
    io.emit('chatMessage', {
        type: 'status',
        text: 'Is now connected',
        created: Date.now(),
        user: {
			email: socket.request.user.email,
			displayName: socket.request.user.displayName,
			username: socket.request.user.username
		}
    });

    // Send a chat messages to all connected sockets when a message is received 
    socket.on('chatMessage', function(message) {
        message.type = 'message';
        message.created = Date.now();
        message.user = {
			email: socket.request.user.email,
			displayName: socket.request.user.displayName,
			username: socket.request.user.username
		};
        // Emit the 'chatMessage' event
        io.emit('chatMessage', message);
    });

    // Emit the status event when a socket client is disconnected
    socket.on('disconnect', function() {
        io.emit('chatMessage', {
            type: 'status',
            text: 'disconnected',
            created: Date.now(),
			user: {
				email: socket.request.user.email,
				displayName: socket.request.user.displayName,
				username: socket.request.user.username
			}
        });
    });
};

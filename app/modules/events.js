'use strict';

var formatMessage = function(message)
{
	if (typeof message === 'object')
		message = '<pre>'+JSON.stringify(message, null, 4)+'</pre>';

	return message;
};

// Handles node errors generated with:
// process.emit('error', err);
var handleError = function(err)
{
	console.trace(err);

	// Log the error in the database?

	// Email the developers?
	var emailBody = formatMessage(err);
};

module.exports = function()
{
	process.on('error', handleError);
};
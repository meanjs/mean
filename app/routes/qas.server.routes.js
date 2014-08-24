'use strict';
//Routes...
module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var qas = require('../../app/controllers/qas');

	// Qas Routes
	app.route('/qas')
		.get(qas.list)
		.post(users.requiresLogin, qas.create);

	app.route('/qas/:qaId')
		.get(qas.read)
		.put(users.requiresLogin, qas.hasAuthorization, qas.update)
		.delete(users.requiresLogin, qas.hasAuthorization, qas.delete);

	// Finish by binding the Qa middleware
	app.param('qaId', qas.qaByID);
};
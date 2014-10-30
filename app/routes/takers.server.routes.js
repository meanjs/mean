'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var takers = require('../../app/controllers/takers');
	var qas = require('../../app/controllers/takers');
	var quizzes = require('../../app/controllers/takers');
	// Takers Routes

	//app.route('/listTakersQuizzes')
	//	.get(quizzes.list)
	//	.post(users.requiresLogin, quizzes.create);
	app.route('/takers')
		.get(takers.list)
		.post(users.requiresLogin, takers.create);
	app.route('/takers/:takerId')
		.get(takers.read)
		.put(users.requiresLogin, takers.hasAuthorization, takers.update)
		.delete(users.requiresLogin, takers.hasAuthorization, takers.delete);

	// Finish by binding the Taker middleware
	app.param('takerId', takers.takerByID);
};

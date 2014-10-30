'use strict';
//Routes...
module.exports = function(app) {
	var users = require('../../app/controllers/users');
    var qas = require('../../app/controllers/qas');
    var quizzes = require('../../app/controllers/quizzes');

	// Qas Routes
//    app.route('/listQasQuizzes')
//        .get(quizzes.list)
//        .post(users.requiresLogin, quizzes.create);

	app.route('/quizzes')
		.get(quizzes.list)
		.post(users.requiresLogin, quizzes.create);

	app.route('/quizzes/:quizId')
		.get(quizzes.read)
		.put(users.requiresLogin, quizzes.hasAuthorization, quizzes.update)
		.delete(users.requiresLogin, quizzes.hasAuthorization, qas.delete);

	// Finish by binding the Qa middleware
	app.param('quizId', quizzes.quizByID);
};

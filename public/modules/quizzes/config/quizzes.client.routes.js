'use strict';

//Setting up route
angular.module('quizzes').config(['$stateProvider',
	function($stateProvider) {
		// Quizzes state routing
		$stateProvider.
		state('listQuizzes', {
			url: '/quizzes',
			templateUrl: 'modules/quizzes/views/list-quizzes.client.view.html'
		}).
		state('createQuiz', {
			url: '/quizzes/create',
			templateUrl: 'modules/quizzes/views/create-quiz.client.view.html'
		}).
		state('viewQuiz', {
			url: '/quizzes/:quizId',
			templateUrl: 'modules/quizzes/views/view-quiz.client.view.html'
		}).
		state('editQuiz', {
			url: '/quizzes/:quizId/edit',
			templateUrl: 'modules/quizzes/views/edit-quiz.client.view.html'
		});
	}
]);
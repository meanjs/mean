'use strict';

//Setting up route...
angular.module('qas').config(['$stateProvider',
	function($stateProvider) {
		// Qas state routing
		$stateProvider.
		state('listQas', {
			url: '/qas',
			templateUrl: 'modules/qas/views/list-qas.client.view.html'
		}).
		state('createQa', {
			url: '/qas/create',
			templateUrl: 'modules/qas/views/create-qa.client.view.html'
		}).
		state('viewQa', {
			url: '/qas/:qaId',
			templateUrl: 'modules/qas/views/view-qa.client.view.html'
		}).
		state('editQa', {
			url: '/qas/:qaId/edit',
			templateUrl: 'modules/qas/views/edit-qa.client.view.html'
		}).
        state('listQasQuizzes', {
            url: '/listQasQuizzes',
            templateUrl: 'modules/qas/views/listquizzes-qas.client.view.html'
        });
	}
]);
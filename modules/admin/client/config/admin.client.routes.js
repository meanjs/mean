'use strict';

// Setting up route
angular.module('admin').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('admin', {
			abstract: true,
			url: '/admin',
			template: '<ui-view/>'
		}).
		state('admin.list', {
			url: '/list',
			templateUrl: 'modules/admin/views/list-users.client.view.html'
		}).
		state('admin.view', {
			url: '/:userId',
			templateUrl: 'modules/admin/views/view-user.client.view.html'
		}).
		state('admin.edit', {
			url: '/edit/:userId',
			templateUrl: 'modules/admin/views/edit-user.client.view.html'
		});
	}
]);

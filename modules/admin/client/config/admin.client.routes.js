'use strict';

// Setting up route
angular.module('admin').config(['$stateProvider',
	function ($stateProvider) {
		// Articles state routing
		$stateProvider
			.state('admin', {
				abstract: true,
				url: '/admin',
				template: '<ui-view/>'
			})
			.state('admin.users', {
				url: '/users',
				templateUrl: 'modules/admin/views/users/user-list.client.view.html',
				controller: 'UserListController'
			})
			.state('admin.user', {
				url: '/users/:userId',
				templateUrl: 'modules/admin/views/users/user.client.view.html',
				controller: 'UserController',
				resolve: {
					userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
						return Admin.get({
							userId: $stateParams.userId
						});
					}]
				}
			})
			.state('admin.user-edit', {
				url: '/users/:userId/edit',
				templateUrl: 'modules/admin/views/users/user-edit.client.view.html',
				controller: 'UserController',
				resolve: {
					userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
						return Admin.get({
							userId: $stateParams.userId
						});
					}]
				}
			});
	}
]);

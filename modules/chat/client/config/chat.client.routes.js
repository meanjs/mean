'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
	function ($stateProvider) {
		$stateProvider
			.state('chat', {
				url: '/chat',
				templateUrl: 'modules/chat/views/chat.client.view.html'
			});
	}
]);

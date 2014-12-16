'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'ReturnUrl',
	function($scope, Authentication, Menus, ReturnUrl) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		ReturnUrl.return();
	}
]);
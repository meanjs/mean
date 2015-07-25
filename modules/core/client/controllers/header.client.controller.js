'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
	function ($scope, $state, Authentication, Menus) {
		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;

		// Get the topbar menu
		$scope.menu = Menus.getMenu('topbar');

		// Toggle the menu items
		$scope.isCollapsed = false;
		$scope.toggleCollapsibleMenu = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function () {
			$scope.isCollapsed = false;
		});
	}
]);

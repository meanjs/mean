'use strict';

angular.module('core').controller('ApplicationController', ['$scope', '$window',
	function ($scope, $window) {
		var vm = this;
		vm.bodyClass = '';

		$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			$window.scrollTo(0, 0);

			if (angular.isDefined(toState.data) && angular.isDefined(toState.data.bodyClass)) {
				vm.bodyClass = toState.data.bodyClass;
				return;
			}

			vm.bodyClass = '';
		});
	}
]);

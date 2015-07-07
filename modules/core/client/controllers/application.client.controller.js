'use strict';

angular.module('core').controller('ApplicationController', ['$scope',
	function ($scope) {
		var vm = this;
		vm.bodyClass = '';

		$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			if (angular.isDefined(toState.data) && angular.isDefined(toState.data.bodyClass)) {
				vm.bodyClass = toState.data.bodyClass;
				return;
			}

			vm.bodyClass = '';
		});
	}
]);
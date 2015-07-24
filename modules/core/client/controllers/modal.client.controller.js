'use strict';

angular.module('core').controller('MeanModalController', ['$scope', '$modalInstance', 'modal',
	function($scope, $modalInstance, modal) {

		$scope.modal = modal;

		if (modal.items !== undefined) {
			$scope.items = modal.items;
			$scope.selected = {
				item: $scope.items[0]
			};
		}

		$scope.ok = function () {
			if ($scope.selected !== undefined) {
				$modalInstance.close($scope.selected.item);
			}
			else {
				$modalInstance.close();
			}

		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

	}
]);

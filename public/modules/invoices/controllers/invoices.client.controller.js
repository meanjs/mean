'use strict';

// Invoices controller
angular.module('invoices').controller('InvoicesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Invoices',
	function($scope, $stateParams, $location, Authentication, Invoices ) {
		$scope.authentication = Authentication;

		// Create new Invoice
		$scope.create = function() {
			// Create new Invoice object
			var invoice = new Invoices ({
				name: this.name
			});

			// Redirect after save
			invoice.$save(function(response) {
				$location.path('invoices/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Invoice
		$scope.remove = function( invoice ) {
			if ( invoice ) { invoice.$remove();

				for (var i in $scope.invoices ) {
					if ($scope.invoices [i] === invoice ) {
						$scope.invoices.splice(i, 1);
					}
				}
			} else {
				$scope.invoice.$remove(function() {
					$location.path('invoices');
				});
			}
		};

		// Update existing Invoice
		$scope.update = function() {
			var invoice = $scope.invoice ;

			invoice.$update(function() {
				$location.path('invoices/' + invoice._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Invoices
		$scope.find = function() {
			$scope.invoices = Invoices.query();
		};

		// Find existing Invoice
		$scope.findOne = function() {
			$scope.invoice = Invoices.get({ 
				invoiceId: $stateParams.invoiceId
			});
		};
	}
]);
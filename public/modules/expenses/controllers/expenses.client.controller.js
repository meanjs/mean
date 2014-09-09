'use strict';

// Expenses controller
angular.module('expenses').controller('ExpensesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Expenses',
	function($scope, $stateParams, $location, Authentication, Expenses ) {
		$scope.authentication = Authentication;

		// Create new Expense
		$scope.create = function() {
			// Create new Expense object
			var expense = new Expenses ({
				name: this.name
			});

			// Redirect after save
			expense.$save(function(response) {
				$location.path('expenses/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Expense
		$scope.remove = function( expense ) {
			if ( expense ) { expense.$remove();

				for (var i in $scope.expenses ) {
					if ($scope.expenses [i] === expense ) {
						$scope.expenses.splice(i, 1);
					}
				}
			} else {
				$scope.expense.$remove(function() {
					$location.path('expenses');
				});
			}
		};

		// Update existing Expense
		$scope.update = function() {
			var expense = $scope.expense ;

			expense.$update(function() {
				$location.path('expenses/' + expense._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Expenses
		$scope.find = function() {
			$scope.expenses = Expenses.query();
		};

		// Find existing Expense
		$scope.findOne = function() {
			$scope.expense = Expenses.get({ 
				expenseId: $stateParams.expenseId
			});
		};
	}
]);
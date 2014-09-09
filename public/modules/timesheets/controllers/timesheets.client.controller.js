'use strict';

// Timesheets controller
angular.module('timesheets').controller('TimesheetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Timesheets',
	function($scope, $stateParams, $location, Authentication, Timesheets ) {
		$scope.authentication = Authentication;

		// Create new Timesheet
		$scope.create = function() {
			// Create new Timesheet object
			var timesheet = new Timesheets ({
				name: this.name
			});

			// Redirect after save
			timesheet.$save(function(response) {
				$location.path('timesheets/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Timesheet
		$scope.remove = function( timesheet ) {
			if ( timesheet ) { timesheet.$remove();

				for (var i in $scope.timesheets ) {
					if ($scope.timesheets [i] === timesheet ) {
						$scope.timesheets.splice(i, 1);
					}
				}
			} else {
				$scope.timesheet.$remove(function() {
					$location.path('timesheets');
				});
			}
		};

		// Update existing Timesheet
		$scope.update = function() {
			var timesheet = $scope.timesheet ;

			timesheet.$update(function() {
				$location.path('timesheets/' + timesheet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Timesheets
		$scope.find = function() {
			$scope.timesheets = Timesheets.query();
		};

		// Find existing Timesheet
		$scope.findOne = function() {
			$scope.timesheet = Timesheets.get({ 
				timesheetId: $stateParams.timesheetId
			});
		};
	}
]);
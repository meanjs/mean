'use strict';

// Quizzes controller
angular.module('quizzes').controller('QuizzesController', ['$scope', '$stateParams', '$location',
    'Authentication', 'Quizzes','qasInitService',
	function($scope, $stateParams, $location, Authentication, Quizzes, qasInitService ) {
		$scope.authentication = Authentication;

		// Create new Quiz
		$scope.create = function() {
			// Create new Quiz object
			var quiz = new Quizzes ({
				name: this.name,
                category: this.category,
                keyWords: this.keyWords,
                quizNumber: this.quizNumber
			});

			// Redirect after save
			quiz.$save(function(response) {
				$location.path('quizzes/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
            console.log(quiz);
			// Clear form fields
            this.name = '';
            this.keyWords = '';
            this.category = '';
            this.quizNumber = '';
		};

		// Remove existing Quiz
		$scope.remove = function( quiz ) {
			if ( quiz ) { quiz.$remove();

				for (var i in $scope.quizzes ) {
					if ($scope.quizzes [i] === quiz ) {
						$scope.quizzes.splice(i, 1);
					}
				}
			} else {
				$scope.quiz.$remove(function() {
					$location.path('quizzes');
				});
			}
		};

		// Update existing Quiz
		$scope.update = function() {
			var quiz = $scope.quiz ;

			quiz.$update(function() {
				$location.path('quizzes/' + quiz._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Quizzes
		$scope.find = function() {
			$scope.quizzes = Quizzes.query();
		};

		// Find existing Quiz
		$scope.findOne = function() {
			$scope.quiz = Quizzes.get({ 
				quizId: $stateParams.quizId
			});
		};
	}
]);
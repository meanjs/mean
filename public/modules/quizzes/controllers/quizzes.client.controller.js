'use strict';

// Quizzes controller
angular.module('quizzes').controller('QuizzesController', ['$scope', '$stateParams', '$location',
    'Authentication', 'Quizzes','Qas','qasInitService',
	function($scope, $stateParams, $location, Authentication, Quizzes,Qas, qasInitService ) {
		$scope.authentication = Authentication;
		$scope.difficultyDropdown = qasInitService.difficultyDropdown();
		// Create new Quiz
		$scope.create = function() {
			// Create new Quiz object
			var quiz = new Quizzes ({
				name: this.name,
                category: this.category,
                keyWords: this.keyWords,
                quizNumber: this.quizNumber,
				hintOn: this.hintOn,
				timeOn:	this.timeOn,
				fifty50On:	this.fifty50On,
				randomizeQuestionsOn: this.randomizeQuestionsOn,
				randomizeAnswersOn: this.randomizeAnswersOn
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
			this.hintOn = "";
			this.timeOn = "";
			this.fifty50On = "";
			this.randomizeQuestionsOn = "";
			this.randomizeAnswersOn = "";
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

		// Find a list of Questions
		$scope.findQas = function() {
			$scope.qas = Qas.query();
		};

		// Find existing Quiz
		$scope.findOne = function() {
			var quiz;
			var qas = Qas.query();
			quiz = Quizzes.get({
				quizId: $stateParams.quizId
			});
			$scope.quiz = quiz;
			$scope.qas = qas;
			$scope.quiz.qa = [];

			//if (qas.choices[0].selectedAnswer)
			//{
			//	$scope.qas.sAnswer[0]=qas[0].choices[0].text
			//};
			$scope.todos =qas;
			//[
			//	{text:'learn angular', done:true, a:[1,2]},
			//	{text:'build an angular app', done:false, a:[3,2]}];

			console.log('todo',qas,Object.keys($scope.todos).length,$scope.todos);
				var oldTodos = $scope.todos;
				$scope.todos = [];
				angular.forEach(oldTodos, function(todo) {
					 $scope.todos.push(todo);
				});

				console.log($scope.todos);


			console.log("from quuizctrl.findOne",$scope.quiz,$scope.quiz.qa);
		};
	}
]);

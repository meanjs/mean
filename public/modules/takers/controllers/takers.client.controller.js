'use strict';

angular.module('takers').controller('TakersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Qas', 'Quizzes','Takers',
    function($scope, $stateParams, $location, Authentication, Qas, Quizzes, Takers) {
        $scope.authentication = Authentication;
		// Takers controller logic

        $scope.taker = new Takers({
            quizNumber: '0',
            trialNumber: '0',
            trialOptions: '',
            results: [{ questionViewed: false, questionAnswered: false,
                questionNumber: '', answer:[{selection: '0', answer: '0'}]}]

        });
      console.log('From ScopeTaker', $scope.taker);
        //$scope.find = function() {
        //    Takers.query(function(qas) {
        //        $scope.qas = qas;
        //        $scope.taker.qa = qas;
        //
        //
        //    });
        //};
       // console.log('From ScopeTaker', $scope.qas);
        // Create and validate taker entries
        $scope.next = function () {

            $scope.questionIndex++;
            taker.questionViewed = true;
            taker.$save(function (response) {
                $location.path('takers/' + response._id);
            });
            console.log('next', $scope.questionIndex);

        };
        $scope.prev = function() {
            $scope.questionIndex--;
            console.log('prev',$scope.questionIndex);
        };

        $scope.answerToggled = function() {
            //var taker = $scope.taker;
            ////Grab data from input boxes
            //
            //console.log(taker);
            //taker.qa.question = qas[questionIndex].question;
            //taker.questionNumber = $scope.questionNumber;
            //console.log('toggledtaker',taker);
            //for (var i=0, ln = taker.qa[$scope.questionIndex].choices.length; i<ln; i++) {
            //    //taker.results.answer.selection[i] = $scope.results.answer.selection[i];
            //    //console.log(taker.results[$scope.questionIndex].answer.isSelected[i],$scope.choice[i].selectedAnswer)
            //    taker.results[$scope.questionIndex].answer.isSelected[i] = $scope.choice[i].selectedAnswer;
            //    taker.updated.push(new Date().getTime());
            //};
            //
            //console.log('From taker 1', taker);
            //// Check that question was entered
            //
            //taker.$save(function (response) {
            //    $location.path('takers/' + response._id);
            //});
            //console.log(taker);
        };
        $scope.find = function() {
            //Qas.query(function (qas) {
            //    $scope.qas = qas;
            //});

               // taker.qa = qas;
                Qas.query(function(qas) {
                    // $scope.qas = qas;
                    $scope.taker.qa = qas;
               console.log('From ScopeTaker1', qas[0].questionNumber, taker.qa[0].question, $scope.taker, taker);
            });
            $scope.questionIndex = 0;
        };

       	}
]);

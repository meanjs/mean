'use strict';

// Qas controller...
angular.module('qas').controller('QasController', ['$scope','$rootScope','$modal', '$stateParams', '$location', 'Authentication',
    'Qas','Quizzes', 'CalculatorService', 'MathService', 'qasInitService',
    function ($scope, $rootScope, $modal, $stateParams, $location, Authentication, Qas,Quizzes, CalculatorService, MathService, qasInitService) {
        $scope.authentication = Authentication;
//Test of Calculator and Math Service
        $scope.doit = CalculatorService.cce(77);

// Initialize Dropdown labels
        $scope.typeDropdown = qasInitService.typeDropdown();
        $scope.difficultyDropdown = qasInitService.difficultyDropdown();

        var selectedQuiz = qasInitService.getSelectedQuiz();
        //console.log('call to qasServiceQuiz',fixedQuiz);

        $scope.qa = qasInitService.init();
// Create and validate qa entries
        $scope.create = function () {
            var quiz = new Quizzes();
            quiz.qa = new Qas({
                question: this.question,
                imageURL: this.imageURL,
                choices: [
                    {text: this.text, selectedAnswer: false      //doesn't work
                    },
                    {text: this.text, selectedAnswer: this.correctAnswer     //doesn't work
                    },
                    {text: this.text, selectedAnswer: this.correctAnswer     //doesn't work
                    }
                ],
                hint: this.hint,
                type: this.td,      //doesn't work
                difficulty: this.difficulty,  //doesn't work
                hintOn: this.hintOn,
                timeOn: this.timeOn,
                fifty50On: this.fifty50On,
                randomizeQuestionsOn: this.randomizeQuestionsOn,
                randomizeAnswersOn: this.randomizeAnswersOn,
                questionNumber: this.questionNumber
            });

//  Hack to load these variables.  Not handled above???
            quiz.qa.choices = $scope.qa.choices;
         //   quiz.qa.difficulty = $scope.quiz.dd.label;
          //  quiz.qa.type = $scope.quiz.td.label;
            quiz.qa.qaQuizName = selectedQuiz[0];
            quiz.qa.qaQuizId = selectedQuiz[1];
            // Check that question was entered
            if (quiz.qa.question.length > 0) {
                var choiceCount = 0;
                //Loop through choices to get at least two
                console.log('qa if', quiz.qa,qa);
                for (var i = 0, ln = quiz.qa.choices.length; i < ln; i++) {
                    var choice = quiz.qa.choices[i].text;
                    console.log('choice', choice, "   i", i);
                    if (choice.length > 0) {
                        choiceCount++;
                    }
                }
                if (choiceCount > 1) {
                    // Call API to save to database


                } else {
                    alert('You must have at least two choices');
                }
            } else {
                alert('You must have a question');
            }
            console.log('qaFinal', quiz,qa);
            qa.$save(function (response) {
                $location.path('qas/' + response._id)
            });
        };

        // Method to add an additional choice option
        $scope.addChoice = function () {
            console.log('qa add', $scope.qa);
            $scope.qa.choices.push({ text: this.text, selectedAnswer: false  });
        };

        $scope.remove = function (qa) {
            if (qa) {
                qa.$remove();

                for (var i in $scope.qas) {
                    if ($scope.qas[i] === qa) {
                        $scope.qas.splice(i, 1);
                    }
                }
            } else {
                $scope.qa.$remove(function () {
                    $location.path('qas');
                });
            }
        };

        $scope.update = function () {
            var qa = $scope.qa;
            console.log('From update', qa);
            if (!qa.updated) {
                qa.updated = [];
            }
            qa.updated.push(new Date().getTime());

            qa.$update(function () {
                $location.path('qas/' + qa._id);
            });
        };

        $scope.find = function () {
            Qas.query(function (qas) {
                $scope.qas = qas;
            });
        };

        $scope.findQuizzes = function () {
            Quizzes.query(function (quizzes) {
                $scope.quizzes = quizzes;
            });
        };
        $scope.findOne = function () {
            Qas.get({
                qaId: $stateParams.qaId
            }, function (qa) {
                $scope.qa = qa;
            });
        };
        $scope.findQuizzesOne = function (quiz) {
           // $scope.quiz = quiz;
            var data = [quiz.name,quiz._id];
            qasInitService.saveSelectedQuiz(data);


            $rootScope.qname = quiz.name;
            console.log($rootScope.qname);
        };

        $scope.deleteChoice = function (ev) {
            var ss = ev.target.innerText.toString() - 1;
            console.log(ss);
            var qa = $scope.qa;
            console.log(qa);
            $scope.qa.choices.splice(ss, 1);
        };
//        $scope.saveToOtherQuiz = function(){
//            var modalInstance = $modal.open({
//                templateUrl: 'modules/qas/views/modal-qa.client.html',
//                controller: ModalInstanceCtrl,
//                resolve: {
//                    items: function () {
//                        return $scope.items;
//                    }
//                }
//            });
//
//            modalInstance.result.then(function (selectedItem) {
//                $scope.selected = selectedItem;
//
//            }, function () {
//                console.log('Modal dismissed at: ' + new Date());
//            });
//        };
//        var ModalInstanceCtrl = function ($scope, $modalInstance, Quizzes) {
//
//            Quizzes.query(function(quizzes){
//                $scope.quizzes = quizzes;
//            });
//            $scope.selected = {
//               // quizzes: $scope.quizzes[0]
//            };
//
//            $scope.ok = function () {
//                $modalInstance.close($scope.selected.item);
//            };
//
//            $scope.cancel = function () {
//                $modalInstance.dismiss('cancel');
//            };
//        };
    }
]);


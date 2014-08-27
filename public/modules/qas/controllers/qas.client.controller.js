'use strict';

// Qas controller...
angular.module('qas').controller('QasController', ['$scope', '$stateParams', '$location', 'Authentication',
    'Qas','CalculatorService','MathService','qasInitService',
    function ($scope, $stateParams, $location, Authentication, Qas, CalculatorService, MathService, qasInitService ) {
        $scope.authentication = Authentication;
//Test of Calculator and Math Service
        $scope.doit = CalculatorService.cce(77);

// Initialize Dropdown labels
        $scope.typeDropdown = qasInitService.typeDropdown();
        $scope.difficultyDropdown = qasInitService.difficultyDropdown();
        var qa = new Qas();
        $scope.qa = qasInitService.init(qa);

     //  $scope.qa.choices.correctAnswer;
        // Create and validate qa entries
        $scope.create = function () {
            var qa = new Qas();
            qa = qasInitService.init(qa);
            console.log('$scope.qa', $scope.qa);
            //qa = $scope.qa;
            console.log('qa', qa);
            // Grab data from input boxes
            qa.question = this.question;
            qa.imageURL = this.imageURL;
            qa.choices.text = [
                { text: this.text },
                { text: this.text },
                { text: this.text }
            ];
            qa.content = this.content;
            qa.hint = this.hint;
            qa.hintOn = this.hintOn;
            qa.timeOn = this.timeOn;
            qa.fifty50On = this.fifty50On;
            qa.randomizeQuestionsOn = this.randomizeQuestionsOn;
            qa.randomizeAnswersOn = this.randomizeAnswersOn;

            console.log('From qa 1', qa);
            // Check that question was entered
            console.log('qa.question.length', qa.question.length);
            if (qa.question.length > 0) {
                var choiceCount = 0;
                //Loop through choices to get at least two
                for (var i = 0, ln = qa.choices.length; i < ln; i++) {
                    var choice = qa.choices[i];
                    if (choice.text.length > 0) {
                        choiceCount++;
                    }
                }
                if (choiceCount > 1) {
                    // Call API to save to database
                    qa.$save(function (response) {
                        $location.path('qas/' + response._id);
                    });
                } else {
                    alert('You must have at least two choices');
                }
            } else {
                alert('You must have a question');
            }
        };

        // Method to add an additional choice option
        $scope.addChoice = function () {
            $scope.qa.choices.push({ text: this.text, correctAnswer: false  });
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

        $scope.findOne = function () {
            Qas.get({
                qaId: $stateParams.qaId
            }, function (qa) {
                $scope.qa = qa;
            });
        };
        $scope.deleteChoice = function (ev) {
            var ss = ev.target.innerText.toString() - 1;
            console.log(ss);
            var qa = $scope.qa;
            console.log(qa);
            $scope.qa.choices.splice(ss, 1);
        };
    }
]);


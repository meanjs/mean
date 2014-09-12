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
        //$scope.dd = difficultyDropdown[i];
       // $scope.td = typeDropdown[i];

        $scope.qa = qasInitService.init();
        //var qa = $scope.qa;
        // Create and validate qa entries
        $scope.create = function () {
           var qa = new Qas({
                question: this.question,
                imageURL: this.imageURL,
                choices: [{
                    text: this.text, selectedAnswer: false      //doesn't work
                }, {text: this.text, selectedAnswer: this.correctAnswer     //doesn't work
                }, {text: this.text, selectedAnswer: this.correctAnswer     //doesn't work
                }],
                hint: this.hint,    //doesn't work
                type: this.td,      //doesn't work
                difficulty: this.difficulty,
                hintOn: this.hintOn,
                timeOn: this.timeOn,
                fifty50On: this.fifty50On,
                randomizeQuestionsOn: this.randomizeQuestionsOn,
                randomizeAnswersOn: this.randomizeAnswersOn
            });

            qa.choices = $scope.qa.choices;
            qa.difficulty = $scope.dd.label;
            qa.type = $scope.td.label;
            console.log('From qa 1',qa);console.log('From $qa 1',$scope.qa);
            // Check that question was entered
            console.log('qa.question.length', qa.question.length);
            if (qa.question.length > 0) {
                var choiceCount = 0;
                //Loop through choices to get at least two
                console.log('qa if', qa);
                for (var i = 0, ln = qa.choices.length; i < ln; i++) {
                    var choice = qa.choices[i].text;
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
            console.log('qaFinal',qa);
            qa.$save(function(response) {
                $location.path('qas/' + response._id)});
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


'use strict';

// Qas controller...
angular.module('qas').controller('QasController', ['$scope', '$stateParams', '$location', 'Authentication',
    'Qas','CalculatorService','MathService',
    function ($scope, $stateParams, $location, Authentication, Qas, CalculatorService, MathService ) {
        $scope.authentication = Authentication;

        $scope.doSquare = CalculatorService.square(16);
        //$scope.doSquare = MathService.multiply(4,4);
       // $scope.doit = MathService.multiply(4,4);
        $scope.doit = CalculatorService.square(4);
        $scope.doit = CalculatorService.cube(9);
        $scope.doit = MathService.add(3,4);
        $scope.doit = CalculatorService.cce(77);



        // Create new Qa
        $scope.typeDropdown = "AAA";
//        $scope.typeDropdown = [
//            {
//                'label': 'FIB',
//                'value': 1
//            },
//            {
//                'label': 'TF',
//                'value': 2
//            },
//            {
//                'label': 'MC',
//                'value': 3
//            },
//            {
//                'label': 'Matching',
//                'value': 4
//            }
//        ];
        $scope.difficultyDropdown = [
            {
                'label': 'Easy',
                'value': 1
            },
            {
                'label': 'Medium',
                'value': 2
            },
            {
                'label': 'Hard',
                'value': 3
            },
            {
                'label': 'Impossible',
                'value': 4
            }
        ];


        $scope.qa = new Qas({
            question: '',
            answer: '',
            choices: [
                { text: '', correctAnswer: false },
                { text: '', correctAnswer: false}
            ],
            content: ''
        });
        //$scope.taker = new Taker({
        //    quizNumber: '9999'});
        console.log('From Scope1 taker', $scope.taker);
        $scope.qa.choices.correctAnswer;
        // Create and validate qa entries
        $scope.create = function () {
            console.log("From QA CReate");
            var qa = $scope.qa;
            // Grab data from input boxes
            qa.question = this.question;
            qa.imageURL = this.imageURL;
            qa.choices.text = [
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



])
//    .service('MathService', function() {
//
//        this.add = function(a, b) { return a + b };
//
//        this.subtract = function(a, b) { return a - b };
//
//        this.multiply = function(a, b) { return a * b };
//
//        this.divide = function(a, b) { return a / b };
//
//    })

//    .service('CalculatorService', function(MathService){
//
//        this.square = function(a) { return MathService.multiply(a,a); };
//        this.cce = function(a) {return a+a*1000};
//        this.cube = function(a) { return MathService.multiply(a, MathService.multiply(a,a)); };
//
//    });

;


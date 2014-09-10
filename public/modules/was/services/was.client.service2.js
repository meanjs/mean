/**
 * Created by EbyC on 8/24/2014.
 */
'use strict';

//Qas service used to communicate Was REST endpoints
angular.module('was')
    .service('wasInitService', [ function() {

        this.typeDropdown = function() { return [
            {
                'label': 'FIB',
                'value': 1
            },
            {
                'label': 'TF',
                'value': 2
            },
            {
                'label': 'MC',
                'value': 3
            },
            {
                'label': 'Matching',
                'value': 4
            }
        ];
        };
        this.difficultyDropdown = function() { return [
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
          };

        this.init = function(wa){return ({
            question: '',
            questionNumber: "",
            imageURL:"",
            choices: [
                { text: '', correctAnswer: false },
                { text: '', correctAnswer: false},
                { text: '', correctAnswer: false}
            ],
            content: '',
            hint:"",
            difficulty:"",
            type:"",
            hintOn:false,
            timeOn:false,
            fifty50On:false,
            randomizeQuestionsOn:false,
            randomizeAnswersOn:false
        });}

    }]);

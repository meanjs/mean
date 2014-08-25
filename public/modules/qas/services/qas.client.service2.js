/**
 * Created by EbyC on 8/24/2014.
 */
'use strict';

//Qas service used to communicate Qas REST endpoints
angular.module('qas').service('qasInitService', [ function() {

    this.init = function() { return [
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

        this.subtract = function(a, b) { return a - b };

        this.multiply = function(a, b) { return a * b };

        this.divide = function(a, b) { return a / b };
    }])

   ;

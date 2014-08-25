/**
 * Created by EbyC on 8/24/2014.
 */
'use strict';

angular.module('qas')
    .service('MathService', [ function() {

        this.add = function(a, b) { return a + b };
        this.subtract = function(a, b) { return a - b };
        this.multiply = function(a, b) { return a * b };
        this.divide = function(a, b) { return a / b };
    }])

     .service('CalculatorService', function(MathService){

        this.square = function(a) { return MathService.multiply(a,a); };
        this.cce = function(a) {return a+a*1000};
        this.cube = function(a) { return MathService.multiply(a, MathService.multiply(a,a)); };

    });


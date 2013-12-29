'use strict';

//Setting up route
angular.module('mean.system').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/signup', {
            templateUrl: 'modules/system/views/signup.html'
        }).
        when('/signin', {
            templateUrl: 'modules/system/views/signin.html'
        }).
        when('/', {
            templateUrl: 'modules/system/views/index.html'
        });
    }
]);
'use strict';

// Setting up route
angular.module('mean.users').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/signup', {
            templateUrl: 'modules/users/views/signup.html'
        }).
        when('/signin', {
            templateUrl: 'modules/users/views/signin.html'
        });
    }
]);
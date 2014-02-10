'use strict';

// Setting up route
angular.module('mean.core').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'modules/core/views/home.html'
        });
    }
]);
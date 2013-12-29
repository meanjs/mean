'use strict';

//Setting up route
angular.module('mean.articles').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/articles', {
            templateUrl: 'modules/articles/views/list.html'
        }).
        when('/articles/create', {
            templateUrl: 'modules/articles/views/create.html'
        }).
        when('/articles/:articleId/edit', {
            templateUrl: 'modules/articles/views/edit.html'
        }).
        when('/articles/:articleId', {
            templateUrl: 'modules/articles/views/view.html'
        });
    }
]); 
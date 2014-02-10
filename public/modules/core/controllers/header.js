'use strict';

angular.module('mean.core').controller('HeaderController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        $scope.authentication = Authentication;

        $scope.menu = [{
            title: 'Articles',
            link: 'articles',
            uiRoute: '/articles'
        }, {
            title: 'New Article',
            link: 'articles/create',
            uiRoute: '/articles/create'
        }];

        $scope.isCollapsed = false;
    }
]);
'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);

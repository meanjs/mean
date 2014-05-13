'use strict';

angular.module('core')
  .controller('HomeController', ['$scope', 'Authentication', function ($scope, Authentication) {
    // This provides Authentication context.
    // see /public/modules/users/services/authentication.client.service.js
    $scope.authentication = Authentication;
  }]);
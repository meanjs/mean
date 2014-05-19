'use strict';

<<<<<<< HEAD
angular.module('core')
  .controller('HomeController', ['$scope', 'Authentication', function ($scope, Authentication) {
    // This provides Authentication context.
    // see /public/modules/users/services/authentication.client.service.js
    $scope.authentication = Authentication;
  }]);
=======
angular.module('core').controller('HomeController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);
>>>>>>> pr/63

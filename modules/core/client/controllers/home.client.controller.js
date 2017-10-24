'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location',
  function ($scope, Authentication, $location) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.signedIn = 0;

    $scope.isOrg = false;
    $scope.isBiz = false;

    // If the user is either empty or undefined, we want to just be on the default page
    if ($scope.authentication.user === '' || $scope.authentication.user === undefined) {
      $scope.isOrg = false;
      $location.path('/');
    }

    else if ($scope.authentication.user.roles.indexOf('Organization') >= 0) {
      $scope.isOrg = true;
      $scope.signedIn = 1;
    }

    else {
      $scope.isOrg = false;
    }

    if ($scope.authentication.user === '' || $scope.authentication.user === undefined) {
      $scope.isBiz = false;
      $location.path('/');
    }

    else if ($scope.authentication.user.roles.indexOf('Business') >= 0) {
      $scope.isBiz = true;
      $scope.signedIn = 1;
    }

    else {
      $scope.isBiz = false;
    }

    // Added more descriptive logging
    console.log('Are we signed in? ' + $scope.signedIn);
    console.log('Are we a business? ' + $scope.isBiz);
    console.log('Are we an org? ' + $scope.isOrg);
  }
]);

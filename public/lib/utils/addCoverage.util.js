'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('robot.util.add.coverage');
angular.module('robot.util.add.coverage').config(['$stateProvider',
  function($stateProvider) {
    // Articles state routing
    $stateProvider.
    state('RobotAddCoverage', {
      url: '/api/robot/coverage',
      controller: 'RobotAddCoverageCtrl'
    });
  }
]);
angular.module('robot.util.add.coverage').controller('RobotAddCoverageCtrl', ['$http',
  function($http) {
    var postUrl = 'coverage/client'
    var data = window.__coverage__ ;
    $http.post(postUrl, data);
  }
]);

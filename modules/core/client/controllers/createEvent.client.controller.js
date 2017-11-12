'use strict';

angular.module('core').controller('createEventController', ['$scope', '$state', '$http', 'Authentication',
	function ($scope, $state, $http, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.createEvent = function(){
      console.log($scope.name);
      console.log($scope.date);
      console.log($scope.sTime);

      $http({
        method: 'POST',
        url:'/api/events',
        data: {
          name : $scope.name,
          dateOfEvent : $scope.date,
          startTime : $scope.sTime,
          endTime : $scope.eTime,
          location: $scope.location,
          taxIdRequired: $scope.requireTax
        }
      }).then(function(res){
        console.log('Successful event');
      },function(res){
        console.log('Failed event');
        console.log(res);
        console.log(name);
        console.log(date);
        console.log(sTime);
      });
    }
  }
  ]);
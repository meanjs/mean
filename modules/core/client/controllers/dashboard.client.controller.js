'use strict';

angular.module('core').controller('DashboardController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.name = null;
    $scope.date = null;
    $scope.eTime = null;
    $scope.sTime = null;
    $scope.banner = null;
    $scope.requireTax = null;
    //$scope.button

    $scope.eventList = [
      {
        bizName: 'Blaze',
        date: '10/17/17',
        status: 'Pending'
      }, {
        bizName: 'Taco Bell',
        date: '11/12/23',
        status: 'Confirmed'
      }, {
        bizName: 'Blaze',
        date: '10/17/17',
        status: 'Pending'
      }, {
        bizName: 'Taco Bell',
        date: '11/12/23',
        status: 'Confirmed'
      }];

    $scope.deleteEvent = function (event) {
      $http({
        method: 'DELETE',
        url: 'api/events/' + event._id
      }).then(function (res) {
        console.log('Successful delete');
        $scope.loadEventList();
      }, function (res) {
        console.log('Failed delete');
      });
    };

    $scope.requestEvent = function (event) {
      console.log(event.organizationsPending.indexOf($scope.authentication.user.displayName));
      console.log(event.organizationsPending);
      if (event.organizationsPending.indexOf($scope.authentication.user.displayName) === -1) {
        var eventPlusName = event.organizationsPending.push($scope.authentication.user.displayName);
      } else {
        return;
      }
      $http({
        method: 'PUT',
        url: 'api/events/' + event._id,
        data: {
          organizationsPending: {
            organizationName: $scope.authentication.user.displayName
          }
        }
      }).then(function (res) {
        console.log('Successful request');
      }, function (res) {
        console.log('Failed request');
        console.log(res);
      });
    };

    $scope.acceptEvent = function (event) {
      console.log(event.organizationsPending[0].organizationName);
      if (event.organizationsPending[0].organizationName === '') {
        return;
      }
      $http({
        method: 'PUT',
        url: 'api/events/' + event._id,
        data: {
          organizationConfirmed: event.organizationsPending[0].organizationName
        }
      }).then(function (res) {
        console.log('Successful accept');
      }, function (res) {
        console.log('Failed accept');
        console.log(res);
      });
    };

    $scope.loadEventList = function () {
      $http({
        method: 'GET',
        url: '/api/events'
      }).then(function (res) {
        console.log('Successful');
        console.log(res);
        $scope.eventList = res.data;
      }, function (res) {
        console.log('Failed');
        console.log(res);
      });
    };

    $scope.loadEventList();

    $scope.filterByUser = function (item) {
      return item.user.displayName === $scope.authentication.user.displayName;
    };

    $scope.createEvent = function (isValid) {
      console.log($scope.name);
      console.log($scope.dateOfEvent);
      console.log($scope.startTime);

      if (!isValid) {
        $scope.$broadcast('Unable to create event');

        return false;
      }

      $http({
        method: 'POST',
        url: '/api/events',
        data: {
          name: $scope.name,
          dateOfEvent: $scope.dateOfEvent,
          startTime: $scope.startTime,
          endTime: $scope.endTime,
          location: $scope.location,
          banner: $scope.banner,
          taxIdRequired: $scope.requireTax
        }
      }).then(function (res) {
        console.log('Successful event');
      }, function (res) {
        console.log('Failed event');
        console.log(res);
        console.log(name);
        //console.log(date);
        //console.log(sTime);
      });

      $scope.name = null;
      $scope.date = null;
      $scope.sTime = null;
      $scope.eTime = null;
      $scope.location = null;
      $scope.banner = null;
      $scope.requireTax = null;

      function errorCallback(res) {
        //error = res.data.message;
      }

      $scope.loadEventList();
    };


    $scope.isOrg = false;
    $scope.isBiz = false;

    if ($scope.authentication.user === '') {
      $scope.isOrg = false;
    } else if ($scope.authentication.user.roles.indexOf('Organization') >= 0) {
      $scope.isOrg = true;
    } else {
      $scope.isOrg = false;
    }

    if ($scope.authentication.user === '') {
      $scope.isBiz = false;
    } else if ($scope.authentication.user.roles.indexOf('Business') >= 0) {
      $scope.isBiz = true;
    } else {
      $scope.isBiz = false;
    }
    //console.log($scope.signedIn);
    console.log($scope.isBiz);
    console.log($scope.isOrg);
  }
]);
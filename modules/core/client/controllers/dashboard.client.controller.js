'use strict';

angular.module('core').controller('DashboardController', ['$scope', '$compile', '$http', 'Authentication',
  function ($scope, $compile, $http, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.events = [];

    //Initialize some variables
    $scope.editEvent_flag = 0;
    $scope.activeTab = 'requests';


    /*
      Function to set the active tab
     */
    $scope.setActiveTab = function(value) {
      $scope.activeTab = value;
    };


    $scope.name = null;
    $scope.date = null;
    $scope.eTime = null;
    $scope.sTime = null;
    $scope.requireTax = null;

    $scope.acceptEvent_flag = 0;

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

    /* add custom event*/
    $scope.addEvent = function(title) {
      $scope.events.push({
        title: title,
        start: new Date(2017, 10, 30)
      });
    };


    //Sends a delete request to remove a passed in event from the DB
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


    //Adds the organization name to the organizationsPending list
    $scope.requestEvent = function (event) {
      if (event.organizationsPending.indexOf($scope.authentication.user.displayName) === -1) {
        event.organizationsPending.push($scope.authentication.user.displayName);
      } else {
        return;
      }
      $http({
        method: 'PUT',
        url: 'api/events/' + event._id,
        data: {
          organizationsPending: event.organizationsPending
        }
      }).then(function (res) {
        console.log('Successful request');
      }, function (res) {
        console.log('Failed request');
        console.log(res);
      });
    };

    //Determines whether or not the current user is confirmed for an event
    $scope.generateStatus = function (event) {
      if (event.organizationConfirmed === $scope.authentication.user.displayName) {
        return 'Accepted';
      } else {
        return 'Pending';
      }
    };

    //Allows a business to change the confirmed org based on it's index in the organizationsPending array
    $scope.acceptEvent = function (index) {
      if ($scope.globalEvent.organizationsPending.length === 0) {
        return;
      }
      $http({
        method: 'PUT',
        url: 'api/events/' + $scope.globalEvent._id,
        data: {
          organizationConfirmed: $scope.globalEvent.organizationsPending[index]
        }
      }).then(function (res) {
        console.log('Successful accept');
        $scope.loadEventList();
        console.log(index);
        console.log($scope.globalEvent);
        console.log($scope.globalEvent.organizationsPending[index]);
      }, function (res) {
        console.log('Failed accept');
        console.log(res);
      });
    };

    //Returns true if the organization's name is not on the organizationsPending array
    $scope.displayOrgNonRequest = function (event) {
      console.log($scope.eventList);
      console.log(event.organizationsPending === []);
      if (event.organizationsPending === []) {
        return true;
      }
      return event.organizationsPending.indexOf($scope.authentication.user.displayName) === -1;
    };

    //Allows an organizations to delete their name from the event that is passed in
    $scope.deleteOrgRequest = function (event) {
      console.log(event.organizationsPending.splice(event.organizationsPending.indexOf($scope.authentication.user.displayName), 1));
      var newConfirmed = event.organizationConfirmed;
      if (newConfirmed === $scope.authentication.user.displayName) {
        newConfirmed = '';
      }
      $http({
        method: 'PUT',
        url: 'api/events/' + event._id,
        data: {
          organizationsPending: event.organizationsPending.splice(event.organizationsPending.indexOf($scope.authentication.user.displayName), 1),
          organizationConfirmed: newConfirmed
        }
      }).then(function (res) {
        console.log('Successful org event delete');
      }, function (res) {
        console.log('Failed org event delete');
        console.log(res);
      });
    };

    //Loads the events database list into the eventList scope variable
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

      console.log($scope.eventList[0].name);
      for (var i = 0; i < $scope.eventList.length-1; i++) {
        $scope.addEvent($scope.eventList[i].name);
      }
    };


    //Initially loading the events
    $scope.loadEventList();

    //Checks if the event was made by the user
    $scope.filterByUser = function (event) {
      return event.user.displayName === $scope.authentication.user.displayName;
    };

    //Checks if the user's name is in the organizationsPending list of an event
    $scope.filterOrgEvents = function (event) {
      return event.organizationsPending.indexOf($scope.authentication.user.displayName) !== -1;
    };

    //Allows a business to create an event
    $scope.createEvent = function () {
      console.log($scope.name);
      console.log($scope.date);
      console.log($scope.sTime);

      $http({
        method: 'POST',
        url: '/api/events',
        data: {
          name: $scope.name,
          dateOfEvent: $scope.date,
          startTime: $scope.sTime,
          endTime: $scope.eTime,
          location: $scope.location,
          taxIdRequired: $scope.requireTax
        }
      }).then(function (res) {
        console.log('Successful event');
      }, function (res) {
        console.log('Failed event');
        console.log(res);
        console.log(name);
      });


       $scope.name = null;
       $scope.date = null;
       $scope.sTime = null;
       $scope.eTime = null;
       $scope.location = null;
       $scope.requireTax = null;

    };

    //Toggles the acceptEvent flag
    $scope.toggleAcceptFlag = function () {
      $scope.acceptEvent_flag = !$scope.acceptEvent_flag;
      console.log($scope.acceptEvent_flag);
    };

    //Sets some global event variable to a variable
    $scope.setGlobalEvent = function (event) {
      console.log('setting event');
      $scope.globalEvent = event;
    };

    //More initializations
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

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();


    /* event source that contains custom events on the scope */


      // { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
      // { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
      // { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
      // { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
      // { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/'}
    /* event source that calls a function on every view switch */


    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {
      element.attr({
        'tooltip': event.title,
        'tooltip-append-to-body': true
      });
      $compile(element)($scope);
    };

    /* config object */
    $scope.uiConfig = {
      calendar: {
        height: 450,
        editable: true,
        header: {
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventRender: $scope.eventRender
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events];

  }


])
;

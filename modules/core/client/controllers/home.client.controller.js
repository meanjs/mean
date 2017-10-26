'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication',
	function ($scope, $http, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    //$scope.signedIn = 0;

    $scope.name = null;
    $scope.date = null;
    $scope.eTime = null;
    $scope.sTime = null;
    $scope.requireTax = null;
    $scope.button

    $scope.eventList = [
    {
      bizName: 'Blaze',
      date: '10/17/17',
      status: 'Pending'
    },{
      bizName: 'Taco Bell',
      date: '11/12/23',
      status: 'Confirmed'
    },{
      bizName: 'Blaze',
      date: '10/17/17',
      status: 'Pending'
    },{
      bizName: 'Taco Bell',
      date: '11/12/23',
      status: 'Confirmed'
    }];

    $scope.deleteEvent = function(event){
      $http({
        method:'DELETE',
        url:'api/events/'+event._id
      }).then(function(res){
        console.log('Successful delete');
      },function(res){
        console.log('Failed delete');
      });
    }
    $scope.loadEventList = function(){
       $http({
      method: 'GET',
      url:'/api/events'
    }).then(function(res){
      console.log('Successful');
      console.log(res);
      $scope.eventList = res.data;
    },function(res){
      console.log('Failed');
      console.log(res);
    });
    }
   
   $scope.loadEventList();

    $scope.filterByUser = function(item){
      return item.user.displayName == $scope.authentication.user.displayName;
    }

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

      $scope.name = null;
      $scope.date = null;
      $scope.sTime = null;
      $scope.eTime = null;
      $scope.location = null;
      $scope.requireTax = null;
    }

    $scope.isOrg = false;
    $scope.isBiz = false;

    if($scope.authentication.user === ""){
        $scope.isOrg = false;
      }else if($scope.authentication.user.roles.indexOf("Organization") >= 0){
        $scope.isOrg = true;
      }else{
        $scope.isOrg = false;
      }

      if($scope.authentication.user === ""){
        $scope.isBiz = false;
      }else if($scope.authentication.user.roles.indexOf("Business") >= 0){
        $scope.isBiz = true;
      }else{
        $scope.isBiz = false;
      }
      //console.log($scope.signedIn);
      console.log($scope.isBiz);
      console.log($scope.isOrg);
    }
]);

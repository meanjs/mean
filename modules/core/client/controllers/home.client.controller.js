'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    //$scope.signedIn = 0;

    $scope.eventList = [
    {
      bizName: 'Blaze',
      date: '10/17/17',
      status: 'Pending'
    },{
      bizName: 'Taco Bell',
      date: '11/12/23',
      status: 'Confirmed'
    }];

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

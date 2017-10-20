(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('ProfilesListController', ProfilesListController);

  ProfilesListController.$inject = ['ProfilesService', '$scope'];

  function ProfilesListController(ProfilesService, $scope) {
    var vm = this;
    //email, password, and age saved in these variables
  	$scope.email = "ENTER AN EMAIL";
  	$scope.password = "ENTER A PASSWORD";
  	$scope.age = "ENTER AN AGE";
    //DO YOUR FRONTEND JS CODE HERE
    $scope.UpdatePersonalProfile = function(){
    //retrieving information by ID
    	var input1 = document.getElementById("inputEmail3").value;
    	var input2 = document.getElementById("inputPassword3").value;
    	var input3 = document.getElementById("inputAge3").value;
    //saving temporary variables to permanent variables
    	$scope.email = input1;
    	$scope.password = input2;
    	$scope.age = input3;
    //display new information in an alert box
		alert("Your new email is: " + $scope.email + "\nYour new password is: " + $scope.password + "\nYour new age is: " + $scope.age);
	}

    vm.profiles = ProfilesService.query();
  }
}());

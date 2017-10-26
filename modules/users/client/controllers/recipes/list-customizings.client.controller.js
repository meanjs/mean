(function () {
  'use strict';

  angular
    .module('users')
    .controller('CustomizeController', CustomizeController);

  CustomizeController.$inject = ['UsersService', '$scope'];

  function CustomizeController(UsersService, $scope) {
    var vm = this;

    $scope.wholename = "Whole Milk";
    $scope.wholeQua = "3"
    $scope.wholeUni = "Cups"
    $scope.wholeCal = "105";
    $scope.wholePro = "8";
    $scope.wholeSug = "13";
    $scope.wholeFat = "2.5";

   	$scope.name = "TEST ALERT";
    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = function(){
    	// var input = document.getElementById("inputEmail3").value;
    	//alert(input)
		  alert($scope.name);
	  }



    // vm.customizings = UsersService.query();
  }
}());

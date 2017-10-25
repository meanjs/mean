(function () {
  'use strict';

  angular
    .module('users')
    .controller('CustomizeController', CustomizeController);

  CustomizeController.$inject = ['UsersService', '$scope'];

  function CustomizeController(UsersService, $scope) {
    var vm = this;

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

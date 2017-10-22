(function () {
  'use strict';

  angular
    .module('customizings')
    .controller('CustomizingsListController', CustomizingsListController);

  CustomizingsListController.$inject = ['CustomizingsService', '$scope'];

  function CustomizingsListController(CustomizingsService, $scope) {
    var vm = this;

   	$scope.name = "thisismyname";
    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = function(){
    	// var input = document.getElementById("inputEmail3").value;
    	//alert(input)
		alert($scope.name);
	}



    vm.customizings = CustomizingsService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope'];

  function HomeController($scope) {
    var vm = this;

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = () => {
		  alert('hello');
    }
    
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value; // Display the default slider value
    
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.innerHTML = this.value;
    }
  



  }
}());

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
    
    //CALORIE SLIDER
    var slider = document.getElementById("calories");
    var output = document.getElementById("calVal");
    output.innerHTML = slider.value; // Display the default slider value
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.innerHTML = this.value;
    }

    $scope.ready = function() {
      var newSelect=document.createElement('select');
          var selectHTML="";
         /* for(i=0; i<choices.length; i=i+1){
              selectHTML+= "<option value='"+choices[i]+"'>"+choices[i]+"</option>";
          }*/
          selectHTML+= "<option value='test'>test</option>";
      
          newSelect.innerHTML= selectHTML;
          document.getElementById('book_selection').appendChild(newSelect);
          
      }


    


  }
}());

(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'Authentication', 'Notification', 'CommunityService'];

  function HomeController($scope, Authentication, Notification, CommunityService) {
    var vm = this;

    //vm.user = Authentication.user;
    //vm.updateUserProfile = updateUserProfile;

    //CALORIE SLIDER
    var slider = document.getElementById("calories");
    var output = document.getElementById("calVal");
    output.innerHTML = slider.value; // Display the default slider value
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.innerHTML = this.value;
    }

    //var test = CommunityService.getCommunityRecipes();
    var test = CommunityService.getList();
    console.log(test);
    




    /*
    $scope.ready = function() {
      var newSelect=document.createElement('select');
          var selectHTML="";
         /* for(i=0; i<choices.length; i=i+1){
              selectHTML+= "<option value='"+choices[i]+"'>"+choices[i]+"</option>";
          }
          selectHTML+= "<option value='test'>test</option>";

          newSelect.innerHTML= selectHTML;
          document.getElementById('book_selection').appendChild(newSelect);

      }
      */




    /*
      filterSelection("all")
      $scope.filterSelection = function(c) {
        var x, i;
        x = document.getElementsByClassName("filterDiv");
        if (c == "all")
          c = "";
        for (i = 0; i < x.length; i++) {
          w3RemoveClass(x[i], "show");
          if (x[i].className.indexOf(c) > -1)
            w3AddClass(x[i], "show");
        }
      }

      $scope.w3AddClass = function(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
          if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
        }
      }

      $scope.w3RemoveClass = function(element, name) {
        var i, arr1, arr2;
        arr1 = element.className.split(" ");
        arr2 = name.split(" ");
        for (i = 0; i < arr2.length; i++) {
          while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
          }
        }
        element.className = arr1.join(" ");
      }*/





  }
}());

(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', 'Authentication', 'Notification', 'TransferService', 'CommunityService', '$state'];

  function HomeController($scope, Authentication, Notification, TransferService, CommunityService, $state) {
    var vm = this;

    vm.authentication = Authentication;

    //CALORIE SLIDER
    var slider = document.getElementById("calories");
    var output = document.getElementById("calVal");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function() {
        output.innerHTML = this.value;
    }

    // Showing community or my recipes
    $scope.showCommunity = true;

    $scope.showPopular = () => {
      $scope.showCommunity = true;
    }

    $scope.showMyRecipes = () => {
      $scope.showCommunity = false;
    }

    // GET COMMUNITY RECIPES
    CommunityService.getList()
      .then(CommunityRecipeSuccess)
      .catch(failure)

    function CommunityRecipeSuccess(response) {
      console.log("Community recipes success: ", response);
      $scope.communityRecipes = response;
    }  
    
    // GET MY RECIPES
    CommunityService.getMyRecipes()
      .then(MyRecipeSuccess)
      .catch(failure)

    function MyRecipeSuccess(response) {
      console.log("My recipes success: ", response.recipes);
      $scope.myRecipes = response.recipes;
    }

    function failure(error) {
      console.log("Failure: ", error);
    }  
  }
}());

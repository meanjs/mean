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

    async function CommunityRecipeSuccess(response) {
      $scope.communityRecipes = await response;

      console.log($scope.communityRecipes);
    }

    // GET MY RECIPES
    CommunityService.getMyRecipes()
      .then(MyRecipeSuccess)
      .catch(failure)

    function MyRecipeSuccess(response) {
      $scope.myRecipes = response.recipes;
    }

    function failure(error) {
      console.log("Failure: ", error);
    } 

    // ADD A RECIPE
    $scope.add = (recipe) => {
      CommunityService.addRecipe(recipe)
        .then(addRecipeSuccess)
        .catch(addRecipeFailure);
    }

    function addRecipeSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Add recipe successful!' });

      CommunityService.getList()
        .then(CommunityRecipeSuccess)
        .catch(failure)

      CommunityService.getMyRecipes()
        .then(MyRecipeSuccess)
        .catch(failure)
    }

    function addRecipeFailure(response) {
      Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Add recipe failed!' });
    }

    // DELETE RECIPE
    $scope.delete = (myRecipe) => {
      console.log(myRecipe);

      CommunityService.deleteThisRecipe(myRecipe)
        .then(deleteRecipeSuccess)
        .catch(deleteRecipeFailure);
    }

    function deleteRecipeSuccess(response) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Delete recipe successful!' });

      // Get updated community and my recipes
      CommunityService.getList()
        .then(CommunityRecipeSuccess)
        .catch(failure)

      CommunityService.getMyRecipes()
        .then(MyRecipeSuccess)
        .catch(failure)
    }

    function deleteRecipeFailure(response) {
      Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Delete recipe failed!' });
    }

  }
}());

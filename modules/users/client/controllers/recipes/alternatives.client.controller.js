(function () {
  'use strict';

  angular
    .module('users')
    .controller('AlternativesController', AlternativesController);

  AlternativesController.$inject = ['UsersService', 'TransferService', '$scope'];

  function AlternativesController(UsersService, TransferService, $scope) {
    var vm = this;

    $scope.alternatives = TransferService.getAlternatives();
    $scope.recipe = TransferService.getRecipe();
    console.log("Here are alternatives: ", $scope.alternatives);
    console.log("Here is the recipe", $scope.recipe);

    $scope.ingredients = $scope.recipe.ingredients;

    // TODO: Sort through alternatives and get healthiest and truest to taste
    // $scope.ingredients.forEach( (ingredient, i) => {
    //   $scope.alternatives.forEach( (alternative, j) => {
        
    //   });
    // });
    /*
    //Alternative Getter
		var apiKey = 'YAJ2M9l67OaqNMPCEfBcoccVtQDY5LPUR20rFzP8';
		var type = "b";
		var format = "json";
		var sort = "n";
		var max = "200";
		var ds = 'Standard Reference';
    $scope.getReport = (searchedItem) => {
			var reportURL = 
			  	"http://api.nal.usda.gov/ndb/reports/" + 
			  	"?ndbno=" + searchedItem + 
          "&type=" + type + 
          "&format=" + format + 
          "&api_key=" + apiKey; 

        getURL(reportURL)
          .then( (results) => {
            $scope.searched = results.data;
            assignFood();
          });
    }

    function assignFood() {
			$scope.food = $scope.searched.report.food.name.toLowerCase();
			$scope.nutrients = $scope.searched.report.food.nutrients;
		}

    function getURL(url) {
			return $http.get(url);
		}
 
    //vm.customizings = UserssService.query();

      function searchAssign(food){
        vm.searchFood = food;
      }*/
      
  }
}());

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
      }
        

        // GET ALTERNATIVES FROM RECIPE
        $scope.map = [];
        $scope.in_food_group;
        $scope.orig_nutrient_amount;
        $scope.all_alt_in_group = [];
        $scope.have_match = 0;
        $scope.c_method = "baked";
        //vm.getAlternatives = getAlternatives;
        function getAlternatives() {
          $scope.map = [];
          $scope.orig_nutrient_amount = 0;
    
          $scope.map.push(vm.searchFood);
    
          $http.get('./modules/users/client/controllers/recipes/food_alternatives.json')
            .then( (response) => {
              response.data.cooking_methods.forEach( (cooking_method, i) => {
                cooking_method.food_groups.forEach( (food_group, j) => {
                  food_group.food_alts.forEach( (food_alt, k) => {
    
                    if((food_alt.db_name == vm.searchFood) && ($scope.c_method == cooking_method.method_name)){
                      $scope.have_match = 1;
                      $scope.orig_ndbno = food_alt.db_ndbno;
                      $scope.in_food_group = food_group.group_name;
                      $scope.orig_nutrient_amount = food_alt.db_main_nutrient.db_amount;
                    }
                    else{
                      $scope.all_alt_in_group.push(food_alt);
                    }
                  });
                  if($scope.have_match == 1){
                    $scope.all_alt_in_group.forEach((alt_item, i) => {
                      if(alt_item.db_main_nutrient.db_amount < $scope.orig_nutrient_amount){
                        $scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name});
                      }
                    });
                  }
                  $scope.have_match = 0;
                  $scope.all_alt_in_group = [];
                });
              });
            });
    
            // FIRST ITEM IN MAP IS THE ORIGINAL ITEM
            //TransferService.setAlternatives($scope.map);
    
            //$state.go('search');
        }
  }
}());

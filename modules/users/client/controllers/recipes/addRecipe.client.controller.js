(function () {
  'use strict';

  angular
    .module('users')
    .controller('AddRecipeController', AddRecipeController);

  AddRecipeController.$inject = ['UsersService', 'TransferService', '$scope', '$http', 
    'Authentication', 'Notification', '$location'];

  function AddRecipeController(UsersService, TransferService, $scope, $http, 
      Authentication, Notification, $location) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateMyRecipes = updateMyRecipes;
    vm.getImage = getImage;

    // Sort alternative ingredients
    async function sort_alt() {
      await $http.get('./modules/users/client/controllers/recipes/food_alternatives.json')
        .then ((response) => {
          $scope.alt_food_object = response.data;

          $scope.alt_food_object.cooking_methods.forEach((cooking_method, i) => {
            cooking_method.food_groups.forEach( (food_group, j) => {
              food_group.food_alts.sort(function(a, b) {
                var nut_valA = a.db_main_nutrient.db_amount;
                var nut_valB = b.db_main_nutrient.db_amount;
                if(nut_valA < nut_valB){
                  return 1;
                }
                else if(nut_valA > nut_valB){
                  return -1;
                }	
                else{
                  return 0;
                }
              });
            });
          });
        });
    }

    sort_alt();

    $scope.recipe = {
      'name': '',
      'directions': '',
      'cookingStyle': '',
      'time':'',
      'healthClassifications': {
        'glutenFree': false,
        'noSugar': false,
        'lowFat': false,
        'vegan': false,
        'lowCalorie': false
      },
      'ingredients': [{
        'name': '',
        'quantity': '',
        'units': ''
      }]
    };

    // GET IMAGE = qwant, can only get a certain amount of requests
    function getImage() {
      const proxyurl = "https://cors-anywhere.herokuapp.com/"; // Fixes CORS permissions issue
      var imageUrl = "https://api.qwant.com/api/search/images?"+ // Gets image
        "count=10&offset=1&q="+$scope.recipe.name+"food";
      
      $http.get(proxyurl + imageUrl)
        .then( function(response) {
          $scope.image = response.data.data.result.items[0].media;
        });
    }

    // Add the recipe
    function updateMyRecipes(isValid) {
      var recipe = $scope.recipe;
      recipe.image = $scope.image;
      getAlternatives();

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.addRecipeForm');
        return false;
      }

      UsersService.addRecipe(recipe)
        .then(success)
        .catch(failure);

      function success(response) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Add recipe successful!' })
      }

      function failure(response) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Add recipe failed!' })
      }

      TransferService.setRecipe(recipe);
      $location.path('/alternatives');
    }

    // GET ALTERNATIVES FROM RECIPE
    function getAlternatives() {
      // Initialize variables
      $scope.map = [];
      $scope.in_food_group;
      $scope.orig_nutrient_amount;
      $scope.all_alt_in_group = [];
      $scope.have_match = 0;
      $scope.top_alt_count = 3;
      $scope.mid_ind;

      $scope.alt_request = 0;
      // 0 - want single healthies alt
      // 1 - want single "tastiest" alt
      // 2 - want 3 alts for ingredients

      // Get alternatives
      $scope.recipe.ingredients.forEach( (ingredient, x) => {
      $scope.alt_food_object.cooking_methods.forEach( (cooking_method, i) => {
        cooking_method.food_groups.forEach( (food_group, j) => {
          food_group.food_alts.forEach( (food_alt, k) => {
              
            //console.log("Ingredient", ingredient.name);
            //console.log("Alt name", food_alt.db_name);
            //console.log($scope.recipe.cookingStyle);
            //console.log("Cooking Method", cooking_method.method_name);
            if((food_alt.db_name == ingredient.name) && ($scope.recipe.cookingStyle == cooking_method.method_name)){
              $scope.have_match = 1;
              console.log(food_alt);
            }
            else if ((food_alt.db_name != ingredient.name) && ($scope.have_match == 1)){
              $scope.all_alt_in_group.push(food_alt);
              console.log(food_alt);
            }			
          });
          $scope.have_match = 0;
        });
      });

      console.log(all_alt_in_group);
      if($scope.all_alt_in_group.length > 0) {
        if($scope.alt_request == 0){
          var alt_item = $scope.all_alt_in_group[$scope.all_alt_in_group.length-1];
          console.log(alt_item);
          $scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount, "flipped": false});
        }
        else if($scope.alt_request == 1){
          var alt_item = $scope.all_alt_in_group[0];
          $scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount, "flipped": false});
        }
        else if($scope.alt_request == 2){
          if($scope.all_alt_in_group.length < $scope.top_alt_count){
            $scope.all_alt_in_group.forEach((alt_item, i) => {
              $scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount, "flipped": false});
            });
          }
          else{
            // Control what alt we give
            mid_ind = $scope.all_alt_in_group.length/2;
            // Index is not whole number
            if(mid_ind % 1 != 0){
              mid_ind = mid_ind - 0.5;
            }
            $scope.all_alt_in_group.forEach((alt_item, i) => {
              if(i==0 || i==mid_ind || i==$scope.all_alt_in_group.length-1){
                $scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount, "flipped": false});
              }
            });
          }		
        }
      }
      else $scope.map.push({"map_name": 'No alternatives available'});
    });
      console.log($scope.map);
      TransferService.setAlternatives($scope.map);
    }

    // Add to ingredient list
    $scope.recipeList = [{}];

    $scope.recipeAdd = function () {
      $scope.recipeList.push({});
    };
    $scope.removeRow = function (ingredient) {
      // $scope.ingredient.splice(idx, 1);
      var index = $scope.recipe.ingredients.indexOf(ingredient);
      $scope.recipe.ingredients.splice(index, 1);
      $scope.recipeList.splice(index,1);
      // $scope.customers.splice($index, 1);
      $scope.$emit('customerDeleted', ingredient); 
    };
  }
}());

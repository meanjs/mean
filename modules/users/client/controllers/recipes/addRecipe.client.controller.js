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

    $scope.recipe = {
      'name': '',
      'directions': '',
      'cookingStyle': '',
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
    $scope.map = [];
    $scope.in_food_group;
    $scope.orig_nutrient_amount;
    $scope.all_alt_in_group = [];
    $scope.have_match = 0;
    $scope.c_method = 'baked';
    $scope.search = 'butter';

    // TODO: Group alternatives to each ingredient in recipe
    function getAlternatives() {
      $scope.map = [];
      $scope.orig_nutrient_amount = 0;

      $http.get('./modules/users/client/controllers/recipes/food_alternatives.json')
        .then((response) => {
          response.data.cooking_methods.forEach((cooking_method, i) => {
            cooking_method.food_groups.forEach((food_group, j) => {
              food_group.food_alts.forEach((food_alt, k) => {

                if ((food_alt.db_name === $scope.search) && ($scope.c_method === cooking_method.method_name)) {
                  $scope.have_match = 1;
                  $scope.orig_ndbno = food_alt.db_ndbno;
                  $scope.in_food_group = food_group.group_name;
                  $scope.orig_nutrient_amount = food_alt.db_main_nutrient.db_amount;
                } else {
                  $scope.all_alt_in_group.push(food_alt);
                }
              });
              if ($scope.have_match === 1) {
                $scope.all_alt_in_group.forEach((alt_item, i) => {
                  if (alt_item.db_main_nutrient.db_amount < $scope.orig_nutrient_amount) {
                    $scope.map.push({ 'map_ndbno': alt_item.db_ndbno, 'map_name': alt_item.db_name });
                  }
                });
              }
              $scope.have_match = 0;
              $scope.all_alt_in_group = [];
            });
          });
        });
      TransferService.setAlternatives($scope.map);
    }

    // Add to ingredient list
    $scope.recipeList = [{}];

    $scope.recipeAdd = function () {
      $scope.recipeList.push({});
    };


    // vm.addings = UsersService.query();
  }
}());

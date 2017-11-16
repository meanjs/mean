(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService', 'TransferService', '$http'];

  function HeaderController($scope, $state, Authentication, menuService, TransferService, $http) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

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

    vm.getAlternatives = getAlternatives;

    function getAlternatives() {
      // Initialize variables
      $scope.map = [];
      $scope.in_food_group;
      $scope.orig_nutrient_amount;
      $scope.all_alt_in_group = [];
      $scope.have_match = 0;
      $scope.top_alt_count = 3;
      $scope.mid_ind;
      $scope.cookingStyle = 'baked';

      $scope.alt_request = 0;
      // 0 - want single healthies alt
      // 1 - want single "tastiest" alt
      // 2 - want 3 alts for ingredients

      $scope.map.push(vm.searchFood);

      // Get alternatives
      $scope.alt_food_object.cooking_methods.forEach( (cooking_method, i) => {
        cooking_method.food_groups.forEach( (food_group, j) => {
          food_group.food_alts.forEach( (food_alt, k) => {
              
            if((food_alt.db_name == vm.searchFood) && ($scope.cookingStyle == cooking_method.method_name)){
              $scope.have_match = 1;
            }
            else if ((food_alt.db_name != vm.searchFood) && ($scope.have_match == 1)){
              $scope.all_alt_in_group.push(food_alt);
            }			
          });
          $scope.have_match = 0;
        });
      });
    
      if($scope.alt_request == 0){
        var alt_item = $scope.all_alt_in_group[$scope.all_alt_in_group.length-1];
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

      // FIRST ITEM IN MAP IS THE ORIGINAL ITEM
      console.log($scope.map);
      TransferService.setAlternatives($scope.map);

      $state.go('search');
    }
  }
}());

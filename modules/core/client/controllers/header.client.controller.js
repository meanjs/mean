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

    // GET ALTERNATIVES FROM RECIPE
    $scope.map = [];
    $scope.in_food_group;
    $scope.orig_nutrient_amount;
    $scope.all_alt_in_group = [];
    $scope.have_match = 0;
    $scope.c_method = 'baked';

    vm.getAlternatives = getAlternatives;

    function getAlternatives() {
      $scope.map = [];
      $scope.orig_nutrient_amount = 0;

      $scope.map.push(vm.searchFood);

      $http.get('./modules/users/client/controllers/recipes/food_alternatives.json')
        .then((response) => {
          response.data.cooking_methods.forEach((cooking_method, i) => {
            cooking_method.food_groups.forEach((food_group, j) => {
              food_group.food_alts.forEach((food_alt, k) => {

                if ((food_alt.db_name === vm.searchFood) && ($scope.c_method === cooking_method.method_name)) {
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

      // FIRST ITEM IN MAP IS THE ORIGINAL ITEM
      TransferService.setAlternatives($scope.map);

      $state.go('search');
    }
  }
}());

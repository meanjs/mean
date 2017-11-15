(function () {
  'use strict';

  angular
    .module('core')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope', 'menuService', 'TransferService', '$http'];

  function SearchController($scope, menuService, TransferService, $http) {
    // $scope.pages = [{name:"Whole Milk", calories:"105", protein:"8", sugar:"13", fat:"2.5"},
    //                 {name:"Comparison View", show: false}
    // ]
    $scope.wholeCal = '105';
    $scope.wholePro = '8';
    $scope.wholeSug = '13';
    $scope.wholeFat = '2.5';

    var vm = this;
    // $scope.show = function(item){
    //   console.log("completed");
    //   item.show = !item.show;
    // }

    $scope.showItem = true;
    $scope.showComparison = false;
    $scope.flipped = false;

    $scope.showI = function () {
      if ($scope.showItem === false) {
        $scope.showItem = true;
        $scope.showComparison = false;
      }
      // $scope.showItem = !$scope.showItem;
    };

    $scope.showC = function () {
      if ($scope.showComparison === false) {
        $scope.showComparison = true;
        $scope.showItem = false;
      }
      // $scope.showItem = !$scope.showItem;
    };

    $scope.flip = function(alternative) {
      $scope.flipped = !$scope.flipped[alternative];
    }
    //function to uppercase the first letter
    $scope.firstUpper = function(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	}

    // FIRST ITME IS ORIGINAL INGREDIENT
    $scope.alternatives = TransferService.getAlternatives();
    console.log('Here are alternatives: ', $scope.alternatives);
    // wholename = searched item
    $scope.wholename = $scope.alternatives[0];
    // alternative1's report
    // $scope.alternative1 = getReport($scope.alternatives[1].map_ndbno);
    // console.log("alternative # 1: ",$scope.alternatives[1].map_ndbno);

    // API KEY
    var apiKey = 'YAJ2M9l67OaqNMPCEfBcoccVtQDY5LPUR20rFzP8';

		// FOR REPORT
    var type = 'b';
    var format = 'json';

		// FOR INDIVIDUAL SEARCHES
    var sort = 'n';
    var max = '200';
    var ds = 'Standard Reference';

    $scope.getReport = (searchedItem) => {
      var reportURL = 
          'http://api.nal.usda.gov/ndb/reports/' + 
          '?ndbno=' + searchedItem + 
          '&type=' + type + 
          '&format=' + format + 
          '&api_key=' + apiKey; 

      getURL(reportURL)
          .then((results) => {
            $scope.searched = results.data;
            assignFood();
          });
    };

    function assignFood() {
      $scope.food = $scope.searched.report.food.name.toLowerCase();
      $scope.nutrients = [];

      $scope.searched.report.food.nutrients.forEach((nutrient, i) => {
        if (nutrient.name === 'Protein') $scope.nutrients.push(nutrient);
        else if (nutrient.name === 'Total lipid (fat)') $scope.nutrients.push(nutrient);
        else if (nutrient.name === 'Carbohydrate, by difference') $scope.nutrients.push(nutrient);
        else if (nutrient.name === 'Fiber, total dietary') $scope.nutrients.push(nutrient);
        else if (nutrient.name === 'Sugars, total') $scope.nutrients.push(nutrient);
        else if (nutrient.name === 'Cholesterol') $scope.nutrients.push(nutrient);
      });

      console.log('nutrients: ', $scope.nutrients);
    }

    function getURL(url) {
      return $http.get(url);
    }

  }
}());

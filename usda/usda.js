// https://health--tracker.herokuapp.com/
//var Listing = require('./food_alternatives.json');

usda.controller('USDAController', 
    function($scope, $http) {
    	// API KEY
		var apiKey = 'YAJ2M9l67OaqNMPCEfBcoccVtQDY5LPUR20rFzP8';

		// FOR REPORT
		var type = "b";
		var format = "json";

		// FOR INDIVIDUAL SEARCHES
		var sort = "n";
		var max = "200";
		var ds = 'Standard Reference';
		$scope.map = [];
		$scope.in_food_group;
		$scope.orig_nutrient_amount;
		$scope.all_alt_in_group = [];
		$scope.have_match = 0;
		$scope.c_method = "baked";

		$scope.getAltFood = () => {
			$http.get('food_alternatives.json')
				.then( (response) => {
					response.data.cooking_methods.forEach( (cooking_method, i) => {
						cooking_method.food_groups.forEach( (food_group, j) => {
							food_group.food_alts.forEach( (food_alt, k) => {

								if((food_alt.db_name == $scope.search) && ($scope.c_method == cooking_method.method_name)){
									console.log(cooking_method);
									console.log($scope.c_method);
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
			$scope.orig_nutrient_amount = 0;
			$scope.map = [];
		}
		
		$scope.doSearch = () => {
			var searchURL = 
				"https://api.nal.usda.gov/ndb/search/" + 
				"?format=" + format + 
				"&q=" + $scope.search + 
				"&ds=" + ds +
				"&sort=" + sort + 
				"&max=" + max + 
				"&api_key=" + apiKey;

			getURL(searchURL)
				.then( (response) => {
					if(response.data.list) $scope.arr = response.data.list.item;
					//console.log(response.data);
				});
		}

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
					//console.log(results.data);
					$scope.assignFood();
				});
		}

		$scope.assignFood = () => {
			$scope.food = $scope.searched.report.food.name.toLowerCase();
			// $scope.ingredients = $scope.searched.report.food.ing.desc.toLowerCase();
			$scope.nutrients = $scope.searched.report.food.nutrients;
		}

		function getURL(url) {
			return $http.get(url);
		}
    }
);








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

	//variables for algorithm
	$scope.map = [];
	$scope.in_food_group;
	$scope.orig_nutrient_amount;
	$scope.all_alt_in_group = [];
	$scope.have_match = 0;
	$scope.c_method = "baked";
	$scope.alt_food_object = {};
	$scope.top_alt_count = 3;
	//0 - want single healthies alt, 1 - want single "tastiest" alt, 2, want 3 alts for ingredients
	$scope.alt_request = 2;
	$scope.mid_ind;

	/*
	$scope.sortAltFood = () => {
		$http.get('food_alternatives.json')
		.then ((response) =>{
			$scope.alt_food_object = response.data;
			$scope.alt_food_object.cooking_methods.forEach((cooking_method, i) => {
				cooking_method.food_groups.forEach( (food_group, j) => {
					food_group.food_alts.sort(function(a, b) {
						var nut_valA = a.db_main_nutrient.db_amount;
						var nut_valB = b.db_main_nutrient.db_amount;
						if(nut_valA < nut_valB){
							return -1;
						}
						else if(nut_valA > nut_valB){
							return 1;
						}	
						else{
							return 0;
						}
					});
				});
			});
		});
		console.log($scope.alt_food_object);
		console.log('hu');
	}
	*/

	//sort alternative ingredients
	function sort_alt() {
		$http.get('food_alternatives.json')
		.then ((response) =>{
			$scope.alt_food_object = response.data;
			//setTimeout(console.log($scope.alt_food_object), 1000);
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

	/*
	$scope.getAltFood = () => {
		$http.get('food_alternatives.json')
			.then( (response) => {
				response.data.cooking_methods.forEach( (cooking_method, i) => {
					cooking_method.food_groups.forEach( (food_group, j) => {
						food_group.food_alts.forEach( (food_alt, k) => {
							
							if((food_alt.db_name == $scope.search) && ($scope.c_method == cooking_method.method_name)){
								$scope.have_match = 1;
								$scope.orig_ndbno = food_alt.db_ndbno;
							}
							else if ((food_alt.db_name != $scope.search) && ($scope.have_match == 1) && ($scope.top_alt_count > 0)){
								$scope.map.push(food_alt);
								$scope.top_alt_count = $scope.top_alt_count-1;
							}

							/*
							if((food_alt.db_name == $scope.search) && ($scope.c_method == cooking_method.method_name)){
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
									$scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount});
									console.log($scope.map);
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
		$scope.top_alt_count = 3;
	}
	//end of getting alt food
	*/

	//get alternatives
	$scope.getAltFood = () => {
		$scope.alt_food_object.cooking_methods.forEach( (cooking_method, i) => {
			cooking_method.food_groups.forEach( (food_group, j) => {
				food_group.food_alts.forEach( (food_alt, k) => {
						
					if((food_alt.db_name == $scope.search) && ($scope.c_method == cooking_method.method_name)){
						$scope.have_match = 1;
					}
					else if ((food_alt.db_name != $scope.search) && ($scope.have_match == 1)){
						$scope.all_alt_in_group.push(food_alt);
					}			
				});
				$scope.have_match = 0;
			});
		});
	
		if($scope.alt_request == 0){
			var alt_item = $scope.all_alt_in_group[$scope.all_alt_in_group.length-1];
			$scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount});
		}
		else if($scope.alt_request == 1){
			var alt_item = $scope.all_alt_in_group[0];
			//console.log($scope.all_alt_in_group);
			$scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount});
		}
		else if($scope.alt_request == 2){
			if($scope.all_alt_in_group.length < $scope.top_alt_count){
				$scope.all_alt_in_group.forEach((alt_item, i) => {
					$scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount});
				});
			}
			else{
				//control what alt we give
				mid_ind = $scope.all_alt_in_group.length/2;
				//index is not whole number
				if(mid_ind % 1 != 0){
					mid_ind = mid_ind - 0.5;
				}
				$scope.all_alt_in_group.forEach((alt_item, i) => {
					if(i==0 || i==mid_ind || i==$scope.all_alt_in_group.length-1){
						$scope.map.push({"map_ndbno": alt_item.db_ndbno, "map_name": alt_item.db_name, "nutrient": alt_item.db_main_nutrient.db_amount});
						//console.log($scope.map);
					}
				});
			}		
		}
		console.log($scope.map);
		$scope.all_alt_in_group = [];
		$scope.map = [];
		$scope.mid_ind = 0;
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
	
	//implement merge sort
	$scope.sortAlt = () => {

	}
	function getURL(url) {
		return $http.get(url);
	}
}
);








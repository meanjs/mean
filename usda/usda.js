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
		$scope.map = {};
		var in_food_group;

		$scope.db = () => {
			$http.get('food_alternatives.json')
				.then( (response) => {
					response.data.food_groups.forEach( (each_food_group, i) => {
						console.log(each_food_group.group_name);
						each_food_group.food_alt.forEach( (alternative, j) => {
							if(alternative.db_name == $scope.search){
								console.log(alternative.db_ndbno);
								$scope.orig_ndbno = alternative.db_ndbno;
								in_food_group = each_food_group;
							}
							//assuming fat content are organized in decreasing order, should list out all teh healthy alternative in console
							//next task is to work on printing out the map and fixing a bug so that the map could be reset for each search
							else if((each_food_group == in_food_group) && (alternative.db_name != $scope.search)){
								//put the rest into an array
								$scope.map[alternative.db_ndbno] = alternative.db_name;
								console.log($scope.map);
							}
						});
					});
				});
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








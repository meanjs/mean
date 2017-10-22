// https://health--tracker.herokuapp.com/
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema, 
    Listing = require('./food_alternatives.json'), 
    config = require('./config');

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

		$scope.findFood = (searchedItem) => {
			var findFood = element(by.model('findFood'));
			findFood.clear();
			findFood.sendKeys('m');
			expectFriendNames(['Mary', 'Mike', 'Adam'], 'friend');

			searchText.clear();
			searchText.sendKeys('76');
			expectFriendNames(['John', 'Julie'], 'friend');
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
		var findAltFoods = funi
    }
);








(function () {
  'use strict';

  angular
    .module('core')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope'];

  function SearchController($scope) {
    $scope.pages = [{name:"Whole Milk", calories:"105", protein:"8", sugar:"13", fat:"2.5"},
                    {name:"Comparison View", show: false}
    ]
    $scope.wholename = "Whole Milk";
    $scope.wholeCal = "105";
    $scope.wholePro = "8";
    $scope.wholeSug = "13";
    $scope.wholeFat = "2.5";

    var vm = this;

    //DO YOUR FRONTEND JS CODE HERE
    $scope.alert = () => {
		  alert('hello');
    }

    // $scope.show = function(item){
    //   console.log("completed");
    //   item.show = !item.show;
    // }

    $scope.showItem = true;
    $scope.showComparison = false;
    $scope.flipped = false;

    $scope.showI = function() {
      if($scope.showItem==false){
        $scope.showItem = true;
        $scope.showComparison = false;
      }
      //$scope.showItem = !$scope.showItem;
    }

    $scope.showC = function() {
      if($scope.showComparison==false){
        $scope.showComparison = true;
        $scope.showItem = false;
      }
      //$scope.showItem = !$scope.showItem;
    }

    $scope.flip = function() {
      $scope.flipped = !$scope.flipped;
    }


  }
}());

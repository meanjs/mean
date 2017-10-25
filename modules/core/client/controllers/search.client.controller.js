(function () {
  'use strict';

  angular
    .module('core')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$scope'];

  function SearchController($scope) {
    $scope.pages = [{name:"Item View", show: true},
                    {name:"Comparison View", show: false}
    ]
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

    $scope.showI = function() {
      if($scope.showItem==false)
        $scope.showItem = true;
      //$scope.showItem = !$scope.showItem;
    }

    $scope.showC = function() {
      if($scope.showComparison==false)
        $scope.showComparison = true;
      //$scope.showItem = !$scope.showItem;
    }


  }
}());

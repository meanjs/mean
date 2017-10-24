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

    $scope.show = function(){
      console.log("completed");
      item.show = !item.show;
    }

    


  }
}());

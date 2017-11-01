(function () {
  'use strict';

  angular
    .module('users')
    .controller('CatalogController', CatalogController);

  CatalogController.$inject = ['$scope', '$state', 'UsersService', '$http'];

  function CatalogController($scope, $state, UsersService, $http) {
    var vm = this;
    $scope.detailedInfo = null;
    $scope.usersList = [];

    $http.get('/catalog/catalog.json').then(function (response) {
      $scope.usersList = response.data;
    }, function (error) {
      $scope.error = 'Unable to retrieve listings!\n' + error;
    });

    // $scope.showDetails = function (index) {
    //   $scope.detailedInfo = $scope.users[index];
    //   $scope.names = $scope.users[index].firstName;
    // };

    $scope.showDetails = function (index) {
      console.log('client showDetails clicked');
      // $scope.detailedInfo = $scope.users[index];
      // var detailUser = {
      //   name: 'Bob test1',
      //   major: 'Undecided'
      // };
      // $scope.detailedInfo = detailUser;
      $scope.detailedInfo = $scope.usersList[index];
    };
  }
}());

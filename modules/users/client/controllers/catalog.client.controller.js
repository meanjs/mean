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

    // $http.get('/catalog/catalog.json').then(function (response) {
    //   $scope.usersList = response.data;
    // }, function (error) {
    //   $scope.error = 'Unable to retrieve listings!\n' + error;
    // });

    $http.get('/api/catalog/students').then(function (response) {
      $scope.usersList = response.data;
    }, function (error) {
      $scope.error = 'Unable to retrieve listings!\n' + error;
    });

    // UsersService.sponsorGetStudents().then(onSponsorGetStudentsSuccess).catch(onSponsorGetStudentsError);

    // $scope.showDetails = function (index) {
    //   $scope.detailedInfo = $scope.users[index];
    //   $scope.names = $scope.users[index].firstName;
    // };

    $scope.showDetails = function (index) {
      $scope.detailedInfo = $scope.usersList[index];
    };

    function onSponsorGetStudentsSuccess(response) {
      $scope.usersList = response.data;
    }

    function onSponsorGetStudentsError(response) {
      $scope.usersList = null;
      $scope.error = 'Unable to retrieve listings!\n' + response.error;
    }
  }
}());

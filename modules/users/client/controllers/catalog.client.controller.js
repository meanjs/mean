(function () {
  'use strict';

  angular
    .module('users')
    .controller('CatalogController', CatalogController);

  CatalogController.$inject = ['$scope', '$state', 'UsersService', 'CatalogService', '$http', 'Notification', '$window', 'Authentication'];

  function CatalogController($scope, $state, UsersService, CatalogService, $http, Notification, $window, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    $scope.detailedInfo = null;
    $scope.usersList = [];

    fetchStudents();

    function fetchStudents() {
      // $http.get('/api/catalog/students').then(function (response) {
      //   onSponsorGetStudentsSuccess(response);
      // }, function (error) {
      //   onSponsorGetStudentsError(error);
      // });
      CatalogService.sponsorGetStudents().then(onSponsorGetStudentsSuccess).catch(onSponsorGetStudentsFailure);
    }

    $scope.showDetails = function (index) {
      $scope.detailedInfo = $scope.usersList[index];
    };

    function onSponsorGetStudentsSuccess(response) {
      console.log('response.data: ' + response);
      $scope.usersList = response;
    }

    function onSponsorGetStudentsFailure(response) {
      $scope.usersList = null;
    }
    function onSponsorGetStudentsError(error) {
      $scope.usersList = null;
    }
  }
}());

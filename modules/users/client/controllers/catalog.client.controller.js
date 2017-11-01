(function () {
  'use strict';

  angular
    .module('users')
    .controller('CatalogController', CatalogController);

  CatalogController.$inject = ['$scope', '$state', 'UsersService', '$http', 'Notification', '$window', 'Authentication'];

  function CatalogController($scope, $state, UsersService, $http, Notification, $window, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    $scope.detailedInfo = null;
    $scope.usersList = [];

    Notification.info({ message: 'Welcome to the catalog page' });
    fetchStudents();

    function fetchStudents() {
      // $http.get('/api/catalog/students').then(function (response) {
      //   onSponsorGetStudentsSuccess(response);
      // }, function (error) {
      //   onSponsorGetStudentsError(error);
      // });
      UsersService.sponsorGetStudents().then(onSponsorGetStudentsSuccess).catch(onSponsorGetStudentsFailure);
    }

    $scope.showDetails = function (index) {
      $scope.detailedInfo = $scope.usersList[index];
    };

    function onSponsorGetStudentsSuccess(response) {
      Notification.info({ message: 'Grabbed them all' });
      $scope.usersList = response.data;
    }

    function onSponsorGetStudentsFailure(response) {
      $scope.usersList = null;
      Notification.info({ message: 'Error Grabbing All' });
    }
    function onSponsorGetStudentsError(error) {
      $scope.usersList = null;
      Notification.info({ message: 'Error Grabbing All' });
    }
  }
}());

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
    $scope.filteredUsersList = [];
    $scope.searchValue = null;
    $scope.shouldShowFilters = false;

    if (vm.authentication.user === null) {
      $state.go('authentication.signin');
    }
    if (vm.authentication.user.type !== 'sponsor' && vm.authentication.user.type !== 'admin') {
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    fetchStudents();

    function fetchStudents() {
      // $http.get('/api/catalog/students').then(function (response) {
      //   onSponsorGetStudentsSuccess(response);
      // }, function (error) {
      //   onSponsorGetStudentsFailure(error);
      // });
      CatalogService.sponsorGetStudents().then(onSponsorGetStudentsSuccess).catch(onSponsorGetStudentsFailure);
    }

    $scope.showDetails = function (index) {
      $scope.detailedInfo = $scope.usersList[index];
    };

    function onSponsorGetStudentsSuccess(response) {
      $scope.usersList = response;
      $scope.filteredUsersList = Array.from($scope.usersList);
    }

    function onSponsorGetStudentsFailure(response) {
      $scope.usersList = null;
      $scope.filteredUsersList = null;
    }

    $scope.toggleFilterOptions = function () {
      $scope.shouldShowFilters = !$scope.shouldShowFilters;
    };

    // filter the current list
    $scope.filterData = function () {
      var originalList = Array.from($scope.usersList);
      var filteredSet = new Set();

      if ($scope.searchValue == null || $scope.searchValue === '') {
        $scope.filteredUsersList = originalList;
      } else {
        for (var i = 0; i < originalList.length; i++) {
          if (originalList[i].firstName !== null || originalList[i].lastName !== null) {
            var firstName = (originalList[i].firstName !== null) ? originalList[i].firstName : '';
            var lastName = (originalList[i].lastName !== null) ? originalList[i].lastName : '';
            var userName = firstName + ' ' + lastName;
            if (userName.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }
          if (originalList[i].major !== null) {
            var major = originalList[i].major;
            if (major.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }
          if (originalList[i].availabilityStatus !== null) {
            var availabilityStatus = originalList[i].availabilityStatus;
            if (availabilityStatus.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }
          if (originalList[i].teamName !== null) {
            var teamName = originalList[i].teamName;
            if (teamName.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }
        }

        $scope.filteredUsersList = Array.from(filteredSet);
      }
    };
  }
}());

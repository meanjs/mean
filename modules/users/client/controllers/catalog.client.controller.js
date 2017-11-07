(function () {
  'use strict';

  angular
    .module('users')
    .controller('CatalogController', CatalogController);

  CatalogController.$inject = ['$scope', '$state', 'UsersService', 'CatalogService', 'Notification', '$window', 'Authentication'];

  function CatalogController($scope, $state, UsersService, CatalogService, Notification, $window, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    $scope.detailedInfo = null;
    $scope.studentsList = [];
    $scope.filteredStudentsList = [];
    $scope.sponsorsList = [];
    $scope.filteredSponsorsList = [];
    $scope.usersList = [];
    $scope.filteredUsersList = [];
    $scope.searchValue = null;
    $scope.shouldShowFilters = false;
    $scope.availabilityOption = false;
    $scope.csOption = false;

    if (vm.authentication.user === null) {
      $state.go('authentication.signin');
    }
    if (vm.authentication.user.type !== 'sponsor' && vm.authentication.user.type !== 'admin') {
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    fetchStudents();

    if (vm.authentication.user.type === 'admin') {
      fetchSponsors();
    }

    function fetchStudents() {
      // $http.get('/api/catalog/students').then(function (response) {
      //   onSponsorGetStudentsSuccess(response);
      // }, function (error) {
      //   onSponsorGetStudentsFailure(error);
      // });
      CatalogService.sponsorGetStudents().then(onSponsorGetStudentsSuccess).catch(onSponsorGetStudentsFailure);
    }

    function fetchSponsors() {
      CatalogService.adminGetSponsors().then(onAdminGetSponsorsSuccess).catch(onAdminGetSponsorsFailure);
    }

    $scope.showDetails = function (index) {
      $scope.detailedInfo = $scope.studentsList[index];
    };

    function onSponsorGetStudentsSuccess(response) {
      $scope.studentsList = response;
      $scope.filteredStudentsList = Array.from($scope.studentsList);
      $scope.filteredUsersList = Array.from($scope.filteredStudentsList);
      if (vm.authentication.user.type === 'admin') {
        $scope.usersList = $scope.studentsList.concat($scope.sponsorsList);
        $scope.filteredUsersList = $scope.filteredStudentsList.concat($scope.filteredSponsorsList);
      }
    }

    function onSponsorGetStudentsFailure(response) {
      $scope.studentsList = null;
      $scope.filteredStudentsList = null;
    }

    function onAdminGetSponsorsSuccess(response) {
      $scope.sponsorsList = response;
      $scope.filteredSponsorsList = Array.from($scope.sponsorsList);
      $scope.usersList = $scope.studentsList.concat($scope.sponsorsList);
      $scope.filteredUsersList = $scope.filteredStudentsList.concat($scope.filteredSponsorsList);
    }

    function onAdminGetSponsorsFailure(response) {
      $scope.sponsorList = null;
      $scope.filteredSponsorsList = null;
    }

    $scope.toggleFilterOptions = function () {
      $scope.shouldShowFilters = !$scope.shouldShowFilters;
    };

    function storeValueForElement(element) {
      if (element.value.toLowerCase() === 'availability') {
        $scope.availabilityOption = element.checked;
      } else if (element.value.toLowerCase() === 'computer-science') {
        $scope.csOption = element.checked;
      }
    }

    $scope.filterOnForm = function () {
      var formElements = document.getElementById('filterOptions').getElementsByTagName('input');
      var originalList = Array.from($scope.usersList);
      var filteredSet = new Set();

      var didFilter = false;
      var firstFilter = true;
      for (var i = 0; i < formElements.length; i++) {
        storeValueForElement(formElements[i]);
        if (formElements[i].checked) {
          didFilter = true;
          filterOnName(formElements[i].value, originalList, filteredSet, firstFilter);
          if (firstFilter) {
            firstFilter = false;
          }
        }
      }

      $scope.filteredUsersList = (didFilter) ? Array.from(filteredSet) : originalList;
    };

    function filterOnName(name, originalList, filteredSet, firstFilter) {
      var currentFilteredSet = new Set();

      for (var i = 0; i < originalList.length; i++) {
        if (name.toLowerCase() === 'availability' && originalList[i].availabilityStatus !== null && originalList[i].availabilityStatus !== undefined) {
          if (originalList[i].availabilityStatus.toLowerCase() === ('available')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'computer-science' && originalList[i].major !== null && originalList[i].major !== undefined) {
          if (originalList[i].major.toLowerCase() === ('computer science')) {
            currentFilteredSet.add(originalList[i]);
          }
        }
      }

      if (firstFilter) {
        filteredSet.clear();
        currentFilteredSet.forEach(function (value) {
          filteredSet.add(value);
        });
      } else {
        var finalFilteredSet = new Set();
        filteredSet.forEach(function (value) {
          if (currentFilteredSet.has(value)) {
            finalFilteredSet.add(value);
          }
        });
        filteredSet.clear();
        finalFilteredSet.forEach(function (value) {
          filteredSet.add(value);
        });
      }

    }

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
          if (originalList[i].major !== null && originalList[i].major !== undefined) {
            var major = originalList[i].major;
            if (major.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }
          if (originalList[i].availabilityStatus !== null && originalList[i].availabilityStatus !== undefined) {
            var availabilityStatus = originalList[i].availabilityStatus;
            if (availabilityStatus.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }
          if (originalList[i].teamName !== null && originalList[i].teamName !== undefined) {
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

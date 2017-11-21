// Controller to change what is updates and viewed in the html when interacting with the catalog
(function () {
  'use strict';

  angular
    .module('users')
    .controller('CatalogController', CatalogController);

  CatalogController.$inject = ['$scope', '$state', 'UsersService', 'CatalogService', 'Notification', '$window', 'Authentication'];

  function CatalogController($scope, $state, UsersService, CatalogService, Notification, $window, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

// Defining the variable that will be changes within the controller
    $scope.detailedInfo = null;
    $scope.lastSelectedIndex = null;
    $scope.studentsList = [];
    $scope.filteredStudentsList = [];
    $scope.sponsorsList = [];
    $scope.filteredSponsorsList = [];
    $scope.usersList = [];
    $scope.filteredUsersList = [];
    $scope.isEditable = false;
    $scope.searchValue = null;
    $scope.shouldShowFilters = false;
    $scope.availabilityOption = false;
    $scope.csOption = false;
    $scope.sponsorOption = false;
    $scope.studentOption = false;

    if (vm.authentication.user === null) {
      $state.go('authentication.signin');
    }
    // Change were the type of user goes to if they are not in the correct screen
    if (vm.authentication.user.type !== 'sponsor' && vm.authentication.user.type !== 'admin') {
      if (vm.authentication.type === 'student') {
        $state.go('profile');
      } else {
        $state.go('home');
      }
    }

// Call the fucntion to ge tthe students in the database
    fetchStudents();

// Show the edit button for the user if they are admin
    if (vm.authentication.user.type === 'admin') {
      $scope.isEditable = true;
    }

    function fetchStudents() {
      // $http.get('/api/catalog/students').then(function (response) {
      //   onSponsorGetStudentsSuccess(response);
      // }, function (error) {
      //   onSponsorGetStudentsFailure(error);
      // });
      // The then and catch function for when the sponsor and admin want to see the students in the database
      CatalogService.sponsorGetStudents().then(onSponsorGetStudentsSuccess).catch(onSponsorGetStudentsFailure);
    }

    function fetchSponsors() {
      // The then and catch function for when the admin want to see the sponsors in the database
      CatalogService.adminGetSponsors().then(onAdminGetSponsorsSuccess).catch(onAdminGetSponsorsFailure);
    }

    $scope.showDetails = function (index) {
      $scope.detailedInfo = $scope.filteredUsersList[index];
      $scope.lastSelectedIndex = index;
    };

    function onSponsorGetStudentsSuccess(response) {
      // Fucntion for when the fetching was a success. An array called studentsList is created
      $scope.studentsList = response;

// If the logged in user is a sponsor then you must filter through the studentsList for approved students
      if (vm.authentication.user.type === 'sponsor') {
        var originalList = Array.from($scope.studentsList);
        var approvedList = new Set();

        for (var i = 0; i < originalList.length; i++) {
          if (originalList[i].approve === (true)) {
            approvedList.add(originalList[i]);
          }
        }
        // Add all the students that are approved to the filteredStudnetsList and usersList
        $scope.filteredStudentsList = Array.from(approvedList);
        $scope.filteredUsersList = Array.from($scope.filteredStudentsList);
        $scope.usersList = Array.from(approvedList);
      }

// If the logged in user is a admin then jsut add all the students from the database to the usersList
      if (vm.authentication.user.type === 'admin') {
        $scope.filteredStudentsList = Array.from($scope.studentsList);
        $scope.filteredUsersList = Array.from($scope.filteredStudentsList);
        $scope.usersList = Array.from($scope.studentsList);
        fetchSponsors();
      }
    }

// Set the studnetList to null if the fetching was unsucessful
    function onSponsorGetStudentsFailure(response) {
      $scope.studentsList = null;
      $scope.filteredStudentsList = null;
    }

// Fucntion for when the admin wants to fetch sponsors was a success
    function onAdminGetSponsorsSuccess(response) {
      // add all the user with a type sponsors to the userList for the admin
      $scope.sponsorsList = response;
      $scope.filteredSponsorsList = Array.from($scope.sponsorsList);
      $scope.usersList = $scope.studentsList.concat($scope.sponsorsList);
      $scope.filteredUsersList = $scope.filteredStudentsList.concat($scope.filteredSponsorsList);
    }

    function onAdminGetSponsorsFailure(response) {
      $scope.sponsorList = null;
      $scope.filteredSponsorsList = null;
    }

// Function for when the admin clicked on the edit button so they can go edit and approve of users.
    $scope.editClicked = function (user) {
      if (vm.authentication.user.type === 'admin') {
        var username = user.username;
        var stateName = 'edit_user?username=' + username;
        var myWindow = window.open(stateName, '_self');
      }
    };

// Fucntion for when the user clicked on go to the studnt profile so they cna see the students profile page.
    $scope.goToStudentProfile = function () {
      if (vm.authentication.user.type === 'admin' || vm.authentication.user.type === 'sponsor') {
        var username = $scope.filteredUsersList[$scope.lastSelectedIndex].username;
        var stateName = 'student_profile?username=' + username;
        var myWindow = window.open(stateName, '_blank');
      }
    };

// Functio for when the admin or sponsor wants to email a certain user
    $scope.emailUser = function (user) {
      window.location.href = 'mailto:' + user.email;
    };

    $scope.toggleFilterOptions = function () {
      $scope.shouldShowFilters = !$scope.shouldShowFilters;
    };

    function storeValueForElement(element) {
      if (element.value.toLowerCase() === 'availability') {
        $scope.availabilityOption = element.checked;
      } else if (element.value.toLowerCase() === 'computer-science') {
        $scope.csOption = element.checked;
      } else if (element.value.toLowerCase() === 'sponsor') {
        $scope.sponsorOption = element.checked;
      } else if (element.value.toLowerCase() === 'student') {
        $scope.studentOption = element.checked;
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

// Fucntion for the search dar that allows the user to filter through the database depending on the major, availablity and type of user
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
        } else if (name.toLowerCase() === 'sponsor' && originalList[i].type !== null && originalList[i].type !== undefined) {
          if (originalList[i].type.toLowerCase() === ('sponsor')) {
            currentFilteredSet.add(originalList[i]);
          }
        } else if (name.toLowerCase() === 'student' && originalList[i].type !== null && originalList[i].type !== undefined) {
          if (originalList[i].type.toLowerCase() === ('student')) {
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

    // Function that allows you to filter thorugh the current lsit that is dispalyed
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
          if (originalList[i].type !== null && originalList[i].type !== undefined) {
            var userType = originalList[i].type;
            if (userType.toLowerCase().includes($scope.searchValue.toLowerCase())) {
              filteredSet.add(originalList[i]);
            }
          }

        }

        $scope.filteredUsersList = Array.from(filteredSet);
      }
    };
  }
}());

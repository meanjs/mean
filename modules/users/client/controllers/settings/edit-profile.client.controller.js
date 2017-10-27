(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'Notification'];

  function EditProfileController($scope, $http, $location, UsersService, Authentication, Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;

    var par = {
      'test' : 'hello'
    };

    $scope.personalProfile = true;
    $scope.healthProfile = false;

    $scope.personal = function() {
      if($scope.personalProfile == false){          //user is on health profile
        $scope.personalProfile = true;             //we still want to show personal profile info when user go back to that page so set that to true
        $scope.healthProfile = false;              //At this point, we are on personal profile page, and we don't want health profile page to show up on personal profile so set that to false
      }
    }

    $scope.health = function() {
      if($scope.healthProfile == false){
        $scope.healthProfile = true;
        $scope.personalProfile = false;
      }
    }
    // TESTING
    UsersService.testing(par)
        .then(success)
        .catch(failure);

    function success(response) {
      console.log('worked!');
      console.log(response);
    }

    function failure(response) {
      console.log('sadness')
      console.log(response);
    }
    // END TESTING

    // Update a user profile
    function updateUserProfile(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!' });
        Authentication.user = response;
      }, function (response) {
        Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!' });
      });
    }

    function updateUserPersonalProfile(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Edit profile successful!' });
        Authentication.user = response;
      }, function (response) {
        Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Edit profile failed!' });
      });
    }
  }
}());

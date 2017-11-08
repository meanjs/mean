(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$scope', '$state', '$http', '$location', 'UsersService', 'Authentication', 'Notification', '$timeout', 'Upload'];

  function EditProfileController($scope, $state, $http, $location, UsersService, Authentication, Notification, $timeout, Upload) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;
    vm.progress = 0;

    if (vm.authentication.user === null) {
      $state.go('authentication.signin');
    }
    if (vm.authentication.user.type !== 'student') {
      $state.go('home');
    }

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

    vm.upload = function (dataUrl) {
      Upload.upload({
        url: '/api/users/picture',
        data: {
          newProfilePicture: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully changed profile picture' });

      // Populate user object
      vm.user = Authentication.user = response;

      updateUserWithBase64Image();

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to change profile picture' });
    }

    function updateUserWithBase64Image() {
      // encode as base 64
      var reader = new FileReader();
      reader.onloadend = function () {
        vm.user.base64ProfileImageURL = reader.result;
        // console.log(vm.user.base64ProfileImageURL);
        var user = new UsersService(vm.user);
        user.base64ProfileImageURL = reader.result;
        user.$update(function (response) {
          console.log('updated image');
          console.log(response);
          Authentication.user = response;
        }, function (response) {
          console.log('failed to update image');
          console.log(response.data.message);
        });
      };
      reader.readAsDataURL($scope.picFile);
    }
  }
}());

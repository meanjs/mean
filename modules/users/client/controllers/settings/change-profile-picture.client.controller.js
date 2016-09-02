(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['$timeout', 'Authentication', 'Upload'];

  function ChangeProfilePictureController($timeout, Authentication, Upload) {
    var vm = this;

    vm.user = Authentication.user;

    vm.upload = function (dataUrl, name) {
      vm.success = vm.error = null;

      Upload.upload({
        url: 'api/users/picture',
        data: {
          newProfilePicture: Upload.dataUrltoBlob(dataUrl, name)
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

    // Called after the user has selected any file and it's been cropped
    vm.onFileSelection = function() {
      vm.success = vm.error = vm.nowResizing = vm.pictureSelected = null;

      // proceed to crop if they didn't cancel and it's a valid image file
      if (vm.picFile && !vm.userForm.$error.pattern) vm.pictureSelected = true;
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      vm.success = true;

      // Populate user object
      vm.user = Authentication.user = response;

      // Reset form
      vm.pictureSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem(response) {
      vm.pictureSelected = false;

      // Show error message
      vm.error = response.message;
    }
  }
}());

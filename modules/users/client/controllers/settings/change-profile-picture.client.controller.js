(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['$timeout', 'Authentication', 'Upload', 'Notification', 'UsersService'];

  function ChangeProfilePictureController($timeout, Authentication, Upload, Notification, Users) {
    var vm = this;

    vm.user = Authentication.user;
    vm.fileSelected = false;
    vm.profileImageFromProvider = false;
    vm.upload = upload;
    vm.importImgFromProvider = importImgFromProvider;
    vm.saveImageFromProvider = saveImageFromProvider;
    vm.selectedFile = selectedFile;
    vm.cancel = cancel;

    initProviders();

    /*
     * Discover user providers
     */
    function initProviders() {
      // Reset providers object
      vm.providers = {};

      // Main provider:
      if (vm.user.provider !== 'local') {
        vm.providers[vm.user.provider] = vm.user.providerData;
      }

      // Additional providers
      for (var provider in vm.user.additionalProvidersData) {
        if (vm.user.additionalProvidersData.hasOwnProperty(provider)) {
          vm.providers[provider] = vm.user.additionalProvidersData[provider];
        }
      }

      // Set profile picture
      for (var _provider in vm.providers) {
        switch (_provider) {
          case 'facebook':
            vm.providers[_provider].profileImageURL = 'https://graph.facebook.com/' + vm.providers[_provider].id + '/picture?type=large';
            break;

          case 'google':
            vm.providers[_provider].profileImageURL = vm.providers[_provider].image.url.replace('sz=50', 'sz=200');
            break;

          case 'linkedin':
            vm.providers[_provider].profileImageURL = vm.providers[_provider].pictureUrl;
            break;

          case 'twitter':
            vm.providers[_provider].profileImageURL = vm.providers[_provider].profile_image_url_https.replace('normal', 'bigger');
            break;

          case 'github':
            vm.providers[_provider].profileImageURL = vm.providers[_provider].avatar_url;
            break;

          case 'paypal':
            vm.providers[_provider].profileImageURL = vm.providers[_provider].picture;
            break;

          default:
            vm.providers[_provider].profileImageURL = '';
        }
      }
    }

    function selectedFile() {
      vm.fileSelected = true;
      vm.profileImageFromProvider = false;
    }

    function importImgFromProvider(provider) {
      vm.profileImageFromProvider = true;
      vm.profileImageUrlProvider = vm.providers[provider].profileImageURL;
    }

    function saveImageFromProvider() {
      vm.user.profileImageURL = vm.profileImageUrlProvider;
      var user = new Users(vm.user);
      user.$update(onSuccessItem, onErrorItem);
    }


    function upload(dataUrl, name) {
      Upload.upload({
        url: '/api/users/picture',
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
    }

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> Change profile picture successful!'
      });

      // Populate user object
      vm.user = Authentication.user = response;

      // Reset form
      cancel();
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;

      // Show error message
      Notification.error({
        message: response.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Change profile picture failed!'
      });
    }

    function cancel() {
      vm.fileSelected = false;
      vm.progress = 0;
      vm.profileImageFromProvider = false;
    }
  }
}());

(function () {
  'use strict';

  // Imagegalleries controller
  angular
    .module('imagegalleries')
    .controller('ImagegalleriesController', ImagegalleriesController);

  ImagegalleriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'imagegalleryResolve'];

  function ImagegalleriesController ($scope, $state, $window, Authentication, imagegallery) {
    var vm = this;

    vm.basePath = "modules/imagegalleries/client/img/";

    vm.imageNames = ["airplane.png","boat.png","fruits.png","tulips.png"];

    vm.authentication = Authentication;
    vm.imagegallery = imagegallery;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Imagegallery
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.imagegallery.$remove($state.go('imagegalleries.list'));
      }
    }

    vm.selectedImages = [];

    vm.selectImage = function(ind){
      
      var index = vm.selectedImages.indexOf(vm.imageNames[ind]);

      if (index > -1) {
        vm.selectedImages.splice(index, 1);
      }else{
        vm.selectedImages.push(vm.imageNames[ind]);  
      }
      
      vm.imagegallery.selectedImage = vm.imageNames[ind];
      vm.imagegallery.paths = vm.selectedImages;
    }

    // Save Imagegallery
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.imagegalleryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.imagegallery._id) {
        vm.imagegallery.$update(successCallback, errorCallback);
      } else {
        vm.imagegallery.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('imagegalleries.view', {
          imagegalleryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

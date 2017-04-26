(function () {
  'use strict';

  angular
    .module('imagegalleries')
    .controller('ImagegalleriesListController', ImagegalleriesListController);

  ImagegalleriesListController.$inject = ['ImagegalleriesService'];

  function ImagegalleriesListController(ImagegalleriesService) {
    var vm = this;

    vm.basePath = "modules/imagegalleries/client/img/";

    vm.imageNames = ["airplane.png","boat.png","fruits.png","tulips.png"];

    vm.imagegalleries = ImagegalleriesService.query();
    console.log(vm);
  }
}());

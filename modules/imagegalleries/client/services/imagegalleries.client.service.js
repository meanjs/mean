// Imagegalleries service used to communicate Imagegalleries REST endpoints
(function () {
  'use strict';

  angular
    .module('imagegalleries')
    .factory('ImagegalleriesService', ImagegalleriesService);

  ImagegalleriesService.$inject = ['$resource'];

  function ImagegalleriesService($resource) {
    return $resource('api/imagegalleries/:imagegalleryId', {
      imagegalleryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

// Customizings service used to communicate Customizings REST endpoints
(function () {
  'use strict';

  angular
    .module('customizings')
    .factory('CustomizingsService', CustomizingsService);

  CustomizingsService.$inject = ['$resource'];

  function CustomizingsService($resource) {
    return $resource('api/customizings/:customizingId', {
      customizingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

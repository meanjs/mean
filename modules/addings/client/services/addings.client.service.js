// Addings service used to communicate Addings REST endpoints
(function () {
  'use strict';

  angular
    .module('addings')
    .factory('AddingsService', AddingsService);

  AddingsService.$inject = ['$resource'];

  function AddingsService($resource) {
    return $resource('api/addings/:addingId', {
      addingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

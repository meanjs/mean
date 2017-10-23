// Addings service used to communicate Addings REST endpoints
(function () {
  'use strict';

  angular
    .module('addings')
    .factory('AddingsService', AddingsService);

  AddingsService.$inject = ['$resource'];

  function AddingsService($resource) {
    var Addings = $resource('api/addings', {addingId: '@_id'}, {
      update: {
        method: 'PUT'
      },
      test: {
        method: 'GET',
        isArray: false
      }
    });

    angular.extend(Addings, {
      testing: function(par) {
        return this.test(par).$promise;
      }
    });

    return Addings;
  }
}());

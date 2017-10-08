// Options service used to communicate Options REST endpoints
(function () {
  'use strict';

  angular
    .module('options')
    .factory('OptionsService', OptionsService);

  OptionsService.$inject = ['$resource'];

  function OptionsService($resource) {
    return $resource('api/options/:optionId', {
      optionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

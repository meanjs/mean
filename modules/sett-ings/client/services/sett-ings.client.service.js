// Sett ings service used to communicate Sett ings REST endpoints
(function () {
  'use strict';

  angular
    .module('sett-ings')
    .factory('SettIngsService', SettIngsService);

  SettIngsService.$inject = ['$resource'];

  function SettIngsService($resource) {
    return $resource('api/sett-ings/:settIngId', {
      settIngId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

// Settings service used to communicate Settings REST endpoints
(function () {
  'use strict';

  angular
    .module('settings')
    .factory('SettingsService', SettingsService);

  SettingsService.$inject = ['$resource'];

  function SettingsService($resource) {
    return $resource('api/settings/:settingId', {
      settingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

// Profiles service used to communicate Profiles REST endpoints
(function () {
  'use strict';

  angular
    .module('profiles')
    .factory('ProfilesService', ProfilesService);

  ProfilesService.$inject = ['$resource'];

  function ProfilesService($resource) {
    return $resource('api/profiles/:profileId', {
      profileId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

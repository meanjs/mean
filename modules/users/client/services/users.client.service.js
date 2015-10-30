'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource', 'CORE_CONST', '$q',
  function($resource, CORE_CONST, $q){
    return $resource(CORE_CONST.REST_URL + 'users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      sign_out: {
        url: CORE_CONST.REST_URL + 'auth/signout',
        method: 'POST'
      }
    });
  }
]);



//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['CORE_CONST', '$resource',
  function (CORE_CONST, $resource) {
    return $resource(CORE_CONST.REST_URL + 'users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

//Replies service used for communicating with the replies REST endpoints
angular.module('replies').factory('Replies', ['$resource',
  function ($resource) {
    return $resource('api/replies/:replyId', {
      replyId: '@_id'
    }, {
      get: { method:'GET', cache: false },
      query: { method:'GET', cache: false, isArray:true },
      update: {
        method: 'PUT'
      }
    });
  }
]);

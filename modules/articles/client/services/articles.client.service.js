'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['CORE_CONST', '$resource',
  function (CORE_CONST, $resource) {
    return $resource(CORE_CONST.REST_URL + 'articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

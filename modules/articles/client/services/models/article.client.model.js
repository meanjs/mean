(function () {
  'use strict';

  angular
    .module('articles.models')
    .factory('Article', Article);

  Article.$inject = ['$resource'];

  function Article($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

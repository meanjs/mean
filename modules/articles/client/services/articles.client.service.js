(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('ArticlesService', ArticlesService);

  ArticlesService.$inject = ['$resource'];

  function ArticlesService($resource) {
    var Article = $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      query: {
        isArray: false,
        params: {
          take: '@take',
          page: '@page'
        }
      },
      pageSortFilter: {
        method: 'POST',
        isArray: false,
        url: 'api/parameterized-query/articles'
      }
    });

    angular.extend(Article.prototype, {
      createOrUpdate: function () {
        var article = this;
        return createOrUpdate(article);
      }
    });

    angular.extend(Article, {
      find: function (options) {
        var articlesResource = this;
        return articlesResource.pageSortFilter(options).$promise;
      },
      list: function (params) {
        var articlesResource = this;
        return articlesResource.query(params).$promise;
      }
    });

    return Article;

    function createOrUpdate(article) {
      if (article._id) {
        return article.$update(onSuccess, onError);
      } else {
        return article.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(article) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      console.log(error);
    }
  }
}());

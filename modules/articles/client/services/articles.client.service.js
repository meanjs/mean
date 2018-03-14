((() => {
  angular
    .module('articles.services')
    .factory('ArticlesService', ArticlesService);

  ArticlesService.$inject = ['$resource', '$log'];

  function ArticlesService($resource, $log) {
    const Article = $resource('/api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Article.prototype, {
      createOrUpdate() {
        const article = this;
        return createOrUpdate(article);
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
        const error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
})());

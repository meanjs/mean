'use strict';

// Articles controller
angular.module('articles')
.controller('ArticlesController', ['$scope', 'article', '$stateParams', '$state', 'Authentication', 'Articles',
  function ($scope, article, $stateParams, $state, Authentication, Articles) {
    $scope.article = article;

    $scope.create = function () {
      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $state.go('articles.list', {articleId: response._id});

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.update = function () {
      var article = $scope.article;

      article.$update(function () {
        $state.go('articles.view',{articleId: article._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function () {
      if (confirm('Are you sure you want to delete?')) {
        $scope.article.$remove(function (article) {
          if ($scope.articles !== undefined && $scope.articles.length > 0) {
            $scope.articles.splice($scope.articles.indexOf($scope.article), 1);
          }
          $state.go('articles.list');
        });
      }
    };

    //Not sure if this is needed anymore?
    $scope.authentication = Authentication;
  }
]);

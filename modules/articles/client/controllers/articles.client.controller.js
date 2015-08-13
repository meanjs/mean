'use strict';

// Articles controller
angular.module('articles')
.controller('ArticlesListController', ['$scope', '$state', 'Articles',
  function ($scope, $stateParams, Articles) {
    //Query Articles
    $scope.articles = Articles.query();
  }
])
.controller('ArticlesViewController', ['$scope', '$state', '$stateParams', 'Articles',
  function ($scope, $state, $stateParams, Articles) {
    //Check if article is loaded if not load it
    if ($scope.article === undefined || typeof $scope.article !== 'object' || $scope.article._id === undefined || $scope.article._id !== $stateParams.articleId) {
      $scope.loadArticleById($stateParams.articleId);
    }

    // Remove existing Article
    $scope.remove = function () {
      $scope.authCheck();
      if (confirm('Are you sure you want to delete?')) {
        $scope.article.$remove(function (article) {
          if ($scope.articles !== undefined && $scope.articles.length > 0) {
            $scope.articles.splice($scope.articles.indexOf($scope.article), 1);
          }
          $state.go('articles.list');
        });
      }
    };
  }
])
.controller('ArticlesEditController', ['$scope', '$state', '$stateParams', 'Authentication', 'Articles',
  function ($scope, $state, $stateParams, Authentication, Articles) {

    //Check if article is loaded if not load it
    if ($scope.article === undefined || typeof $scope.article !== 'object' || $scope.article._id === undefined || $scope.article._id !== $stateParams.articleId) {
      $scope.loadArticleById($stateParams.articleId);
    }

    //Auth Check on Edit Route
    $scope.authCheck();

    $scope.update = function () {
      var article = $scope.article;

      article.$update(function () {
        $state.go('articles.view',{articleId: article._id});
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
])
.controller('ArticlesCreateController', ['$scope', '$state', '$stateParams', 'Authentication', 'Articles',
  function ($scope, $state, $stateParams, Authentication, Articles) {
    // Create new Article
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
  }
])
.controller('ArticlesController', ['$scope', '$stateParams', '$state', 'Authentication', 'Articles',
  function ($scope, $stateParams, $state, Authentication, Articles) {

    $scope.loadArticleById = function (id) {
      $scope.article = Articles.get({
        articleId: id
      });

      $scope.article.$promise.then(function (article) {
        if (article === undefined || typeof article !== 'object' || article._id === undefined) {
          //Article not found
          $state.go('not-found');
        }
      });
    };

    $scope.authCheck = function () {
      $scope.article.$promise.then(function (article) {
        //Make sure user is authorized if not on the view state
        if ($scope.article.user._id !== Authentication.user._id) {
          //TODO  Change to unauthorized when that PR is merged
          $state.go('articles.list');
        }
      });
    };

    //Not sure if this is needed anymore?
    $scope.authentication = Authentication;
  }
]);

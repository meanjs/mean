'use strict';

// Articles List controller
angular.module('articles')
.controller('ArticlesListController', ['$scope', 'articles',
  function ($scope, articles) {
    //Query Articles
    $scope.articles = articles;
  }
]);

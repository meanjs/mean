'use strict';

// Articles List controller
angular.module('articles')
.controller('ArticlesListController', ['$scope', 'Articles',
  function ($scope, Articles) {
    //Query Articles
    Articles.query().$promise.then(function (articles) {
      $scope.articles = articles;
    });
  }
]);

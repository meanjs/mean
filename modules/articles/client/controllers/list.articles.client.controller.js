(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['Article'];

  function ArticlesListController(Article) {
    var vm = this;

    vm.articles = Article.query();
  }
})();

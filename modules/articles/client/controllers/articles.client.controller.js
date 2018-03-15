((() => {
  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', 'articleResolve', 'Authentication'];

  function ArticlesController($scope, article, Authentication) {
    const vm = this;

    vm.article = article;
    vm.authentication = Authentication;
  }
})());

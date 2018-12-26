(() => {
  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService'];

  function ArticlesListController(ArticlesService) {
    const vm = this;

    vm.articles = ArticlesService.query();
  }
})();

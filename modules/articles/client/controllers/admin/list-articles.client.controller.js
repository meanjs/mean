(() => {
  angular
    .module('articles.admin')
    .controller('ArticlesAdminListController', ArticlesAdminListController);

  ArticlesAdminListController.$inject = ['ArticlesService'];

  function ArticlesAdminListController(ArticlesService) {
    const vm = this;

    vm.articles = ArticlesService.query();
  }
})();

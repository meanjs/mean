(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService'];

  function ArticlesListController(ArticlesService) {
    var vm = this;

    vm.error = null;
    vm.find = find;

    activate();

    function activate() {
      vm.itemsPerPage = 20;
      vm.currentPage = 1;

      find();
    }

    function find() {
      ArticlesService.list({
        take: vm.itemsPerPage,
        page: vm.currentPage
      })
        .then(onSearchSuccess)
        .catch(onSearchError);
    }

    function onSearchSuccess(response) {
      vm.error = null;
      vm.totalCount = response.count;
      vm.articles = response.articles;
    }

    function onSearchError(response) {
      vm.error = response.data.message;
    }
  }
}());

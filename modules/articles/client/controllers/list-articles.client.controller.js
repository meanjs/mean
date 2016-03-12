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
      vm.filters = [];
      vm.sorting = '-created';

      find();
    }

    function find() {
      ArticlesService.find({
        take: vm.itemsPerPage,
        page: vm.currentPage,
        filters: vm.filters,
        sorting: vm.sorting
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

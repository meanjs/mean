(function () {
  'use strict';

  angular
    .module('articles.admin')
    .controller('ArticlesAdminListController', ArticlesAdminListController);

  ArticlesAdminListController.$inject = ['ArticlesService'];

  function ArticlesAdminListController(ArticlesService) {
    var vm = this;

    vm.error = null;
    vm.find = find;

    activate();

    function activate() {
      vm.itemsPerPage = 10;
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

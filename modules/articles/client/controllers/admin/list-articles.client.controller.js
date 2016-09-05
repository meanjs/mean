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
    vm.filter = filter;
    vm.reset = reset;

    activate();

    function activate() {
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.filters = [];
      vm.sorting = '-created';
      vm.search = null;
      vm.filtered = false;

      find();
    }

    function reset() {
      // Do something here before
      // we re-activate the vm.

      activate();
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

    function filter() {
      vm.filters = [{
        title: vm.search
      }];

      // Start at first page for our filter
      vm.currentPage = 1;
      // Notify vm that a filter has been applied
      vm.filtered = true;

      find();
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

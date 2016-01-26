(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService', $filter) {
    var vm = this;

    ArticlesService.query(function (data) {
      vm.articles = data;
      vm.buildPager();
    });

    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = 5;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    vm.figureOutItemsToDisplay = function () {
      vm.filteredItems = $filter('filter')(vm.articles, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    };

    vm.pageChanged = function () {
      vm.figureOutItemsToDisplay();
    };
  }
})();

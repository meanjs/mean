(function () {
  'use strict';

  angular
    .module('items.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.items', {
        abstract: true,
        url: '/items',
        template: '<ui-view/>'
      })
      .state('admin.items.modules', {
        url: '/modules',
        templateUrl: '/modules/items/client/views/admin/add-delete-modules.view.html',
        controller: 'ItemsAdminModulesController',
        controllerAs: 'vm',
        css: 'css/add-delete-categories-module.css'
      })
      .state('admin.items.modulecreate', {
        url: '/modules/create',
        controller: 'ModsController',
        controllerAs: 'vm',
        templateUrl: '/modules/items/client/views/admin/form-module.client.view.html',
        resolve: {
          modResolve: newMod
        }
      })
      .state('admin.items.categories', {
        url: '/categories',
        templateUrl: '/modules/items/client/views/admin/add-delete-categories.view.html',
        controller: 'ItemsAdminCategoriesController',
        controllerAs: 'vm',
        css: 'css/add-delete-categories-module.css'
      })
      .state('admin.items.categorycreate', {
        url: '/categories/create',
        templateUrl: '/modules/items/client/views/admin/form-category.client.view.html',
        controller: 'CatsController',
        controllerAs: 'vm',
        resolve: {
          catResolve: newCat
        }
        });
  }

  getItem.$inject = ['$stateParams', 'ItemsService'];

  function getItem($stateParams, ItemsService) {
    return ItemsService.get({
      itemId: $stateParams.itemId
    }).$promise;
  }

  newItem.$inject = ['ItemsService'];

  function newItem(ItemsService) {
    return new ItemsService();
  }
  newCat.$inject = ['CategoriesService'];

  function newCat(CategoriesService) {
    return new CategoriesService();
  }

  newMod.$inject = ['ModulesService'];

  function newMod(ModulesService) {
    return new ModulesService();
  }
}());

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
      .state('admin.items.list', {
        url: '',
        templateUrl: '/modules/items/client/views/admin/list-items.client.view.html',
        controller: 'ItemsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['ta', 'technician', 'superta', 'admin']
        }
      })
      .state('admin.items.modules', {
        url: '/modules',
        templateUrl: '/modules/items/client/views/admin/add-delete-modules.view.html',
        controller: 'ItemsAdminModulesController',
        controllerAs: 'vm',
        css: 'css/add-delete-categories-module.css'
      })
      .state('admin.items.modulecreate',{
        url: '/modules/create',
        templateUrl: '/modules/items/client/views/admin/form-module.client.view.html'
      })
      .state('admin.items.categories', {
        url: '/categories',
        templateUrl: '/modules/items/client/views/admin/add-delete-categories.view.html',
        controller: 'ItemsAdminCategoriesController',
        controllerAs: 'vm',
        css: 'css/add-delete-categories-module.css'
      })
      .state('admin.items.categorycreate',{
        url: '/categories/create',
        templateUrl: '/modules/items/client/views/admin/form-category.client.view.html'
      })
      .state('admin.items.create', {
        url: '/items/create',
        templateUrl: '/modules/items/client/views/admin/form-item.client.view.html',
        controller: 'ItemsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['ta', 'technician', 'superta', 'admin']
        },
        resolve: {
          itemResolve: newItem
        }
      })
      .state('admin.items.edit', {
        url: '/:itemId/edit',
        templateUrl: '/modules/items/client/views/admin/form-item.client.view.html',
        controller: 'ItemsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['ta', 'technician', 'superta', 'admin'],
          pageTitle: '{{ itemResolve.title }}'
        },
        resolve: {
          itemResolve: getItem
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
}());

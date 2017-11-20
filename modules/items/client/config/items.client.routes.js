(function () {
  'use strict';

  angular
    .module('items.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('items', {
        abstract: true,
        url: '/items',
        template: '<ui-view/>'
      })
      .state('items.list', {
        url: '',
        templateUrl: '/modules/items/client/views/list-items.client.view.html',
        controller: 'ItemsListController',

      })
      .state('items.create', {
        url: '/create',
        templateUrl: '/modules/items/client/views/form-item.client.view.html',
        controller: 'ItemsController',
        controllerAs: 'vm',
        data: {
          roles: ['ta', 'technician', 'superta', 'admin']
        },
        resolve: {
          itemResolve: newItem
        }
      })
      .state('items.edit', {
        url: '/:itemId/edit',
        templateUrl: '/modules/items/client/views/form-item.client.view.html',
        controller: 'ItemsController',
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

  newCat.$inject = ['CategoriesService'];

  function newCat(CategoriesService) {
    return new CategoriesService();
  }

  newMod.$inject = ['ModulesService'];

  function newMod(ModulesService) {
    return new ModulesService();
  }

}());

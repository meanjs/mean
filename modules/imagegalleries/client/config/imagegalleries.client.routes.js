(function () {
  'use strict';

  angular
    .module('imagegalleries')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('imagegalleries', {
        abstract: true,
        url: '/imagegalleries',
        template: '<ui-view/>'
      })
      .state('imagegalleries.list', {
        url: '',
        templateUrl: 'modules/imagegalleries/client/views/list-imagegalleries.client.view.html',
        controller: 'ImagegalleriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Imagegalleries List'
        }
      })
      .state('imagegalleries.create', {
        url: '/create',
        templateUrl: 'modules/imagegalleries/client/views/form-imagegallery.client.view.html',
        controller: 'ImagegalleriesController',
        controllerAs: 'vm',
        resolve: {
          imagegalleryResolve: newImagegallery
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Imagegalleries Create'
        }
      })
      .state('imagegalleries.edit', {
        url: '/:imagegalleryId/edit',
        templateUrl: 'modules/imagegalleries/client/views/form-imagegallery.client.view.html',
        controller: 'ImagegalleriesController',
        controllerAs: 'vm',
        resolve: {
          imagegalleryResolve: getImagegallery
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Imagegallery {{ imagegalleryResolve.name }}'
        }
      })
      .state('imagegalleries.view', {
        url: '/:imagegalleryId',
        templateUrl: 'modules/imagegalleries/client/views/view-imagegallery.client.view.html',
        controller: 'ImagegalleriesController',
        controllerAs: 'vm',
        resolve: {
          imagegalleryResolve: getImagegallery
        },
        data: {
          pageTitle: 'Imagegallery {{ imagegalleryResolve.name }}'
        }
      });
  }

  getImagegallery.$inject = ['$stateParams', 'ImagegalleriesService'];

  function getImagegallery($stateParams, ImagegalleriesService) {
    return ImagegalleriesService.get({
      imagegalleryId: $stateParams.imagegalleryId
    }).$promise;
  }

  newImagegallery.$inject = ['ImagegalleriesService'];

  function newImagegallery(ImagegalleriesService) {
    return new ImagegalleriesService();
  }
}());

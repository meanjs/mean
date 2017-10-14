(function () {
  'use strict';

  angular
    .module('profiles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('profiles', {
        abstract: true,
        url: '/profiles',
        template: '<ui-view/>'
      })
      .state('profiles.list', {
        url: '',
        templateUrl: 'modules/profiles/client/views/list-profiles.client.view.html',
        controller: 'ProfilesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Profiles List'
        },
        css: 'modules/profiles/client/css/list-profile.css'
      })
      .state('profiles.create', {
        url: '/create',
        templateUrl: 'modules/profiles/client/views/form-profile.client.view.html',
        controller: 'ProfilesController',
        controllerAs: 'vm',
        resolve: {
          profileResolve: newProfile
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Profiles Create'
        }
      })
      .state('profiles.edit', {
        url: '/:profileId/edit',
        templateUrl: 'modules/profiles/client/views/form-profile.client.view.html',
        controller: 'ProfilesController',
        controllerAs: 'vm',
        resolve: {
          profileResolve: getProfile
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Profile {{ profileResolve.name }}'
        }
      })
      .state('profiles.view', {
        url: '/:profileId',
        templateUrl: 'modules/profiles/client/views/view-profile.client.view.html',
        controller: 'ProfilesController',
        controllerAs: 'vm',
        resolve: {
          profileResolve: getProfile
        },
        data: {
          pageTitle: 'Profile {{ profileResolve.name }}'
        }
      });
  }

  getProfile.$inject = ['$stateParams', 'ProfilesService'];

  function getProfile($stateParams, ProfilesService) {
    return ProfilesService.get({
      profileId: $stateParams.profileId
    }).$promise;
  }

  newProfile.$inject = ['ProfilesService'];

  function newProfile(ProfilesService) {
    return new ProfilesService();
  }
}());

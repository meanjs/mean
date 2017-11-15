(function () {
  'use strict';

  angular
    .module('core')
    .factory('CommunityService', CommunityService);

  CommunityService.$inject = ['$resource'];

  // This calls APIs to get community and my recipes
  function CommunityService($resource) {
    var Community = $resource('/api/users/community', {}, {
      listRecipes: {
        method: 'GET',
        url: '/api/users/community'
      },
      myRecipes: {
        method: 'GET',
        url: '/api/users/myRecipes'
      }
    });

    angular.extend(Community, {
      getList: function () {
        return this.listRecipes().$promise;
      },
      getMyRecipes: function () {
        return this.myRecipes().$promise;
      }
    });

    return Community;
  }
}());

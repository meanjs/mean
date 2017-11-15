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
      },
      add: {
        method: 'POST',
        url: '/api/users/add'
      },
      deleteRecipe: {
        method: 'POST',
        url: '/api/users/deleteRecipe'
      }
    });

    angular.extend(Community, {
      getList: function () {
        return this.listRecipes().$promise;
      },
      getMyRecipes: function () {
        return this.myRecipes().$promise;
      },
      addRecipe: function(param) {
        return this.add(param).$promise;
      },
      deleteThisRecipe: function(recipe) {
        return this.deleteRecipe(recipe).$promise;
      }
    });

    return Community;
  }
}());

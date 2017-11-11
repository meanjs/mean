(function () {
  'use strict';

angular
    .module('core')
    .factory('CommunityService', CommunityService);

  CommunityService.$inject = ['$resource'];

  // This transfers data from one page to another
   function CommunityService($resource) {
  //   return $resource('/api/community', {}, {
  //     communityRecipes: {
  //       method: 'GET'
  //     }
  //   });
  // }
  
    // var Community = $resource('/api/community', {}, {
    //   communityRecipes: {
    //     method: 'GET',
    //     url: '/api/community'
    //   }
    // });

    // angular.extend(Community, {
    //   getCommunityRecipes: function () {
    //     return this.communityRecipes().$promise;
    //   }
    // });

    // return Community;

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
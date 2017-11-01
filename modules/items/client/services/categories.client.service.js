(function () {
  'use strict';

  angular
    .module('items.services')
    .factory('CategoriesService', CategoriesService);


  CategoriesService.$inject = ['$resource', '$log'];
  function CategoriesService($resource, $log) {
    var Category = $resource('/api/categories', {},
    {
      list: {
        method: 'GET'
      },
      new:{
        method: 'POST'
      },
      rem:{
        method: 'DELETE'
      }
    });

    angular.extend(Category, {
      create: function (cat) {
        return this.new(cat).$promise;
      },
      delete: function (cat) {
        return this.rem(cat).$promise;
      },
      getAll: function () {
        return this.list().$promise;
      }
    });

    return Category;
  }
}());

(function () {
  'use strict';

  angular
    .module('items.services')
    .factory('ModulesService', ModulesService);

  ModulesService.$inject = ['$resource', '$log'];

  function ModulesService($resource, $log) {
    var Module = $resource('/api/modules', {}, 
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

    angular.extend(Module, {
      create: function (mod) {
        return this.new(mod).$promise;
      },
      delete: function (mod) {
        return this.del(mod).$promise;
      },
      getAll: function () {
        return this.list().$promise;
      }
    });

    return Module;
  }
}());
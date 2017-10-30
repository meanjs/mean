(function () {
  'use strict';

  angular
    .module('modules.services')
    .factory('ModulesService', ModulesService);

  ModulesService.$inject = ['$resource', '$log'];

  function ModulesService($resource, $log) {
    var Module = $resource('/api/modules/:moduleId', {
      moduleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Module.prototype, {
      createOrUpdate: function () {
        var module = this;
        return createOrUpdate(module);
      }
    });

    return Module;

    function createOrUpdate(module) {
      if (module._id) {
        return module.$update(onSuccess, onError);
      } else {
        return module.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(module) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());

(function () {
  'use strict';

  angular
    .module('items.services')
    .factory('ItemsService', ItemsService);

  ItemsService.$inject = ['$resource', '$log'];

  function ItemsService($resource, $log) {
    var Item = $resource('/api/items/:itemId', {
      itemId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Item.prototype, {
      createOrUpdate: function () {
        var item = this;
        return createOrUpdate(item);
      }
    });

    return Item;

    function createOrUpdate(item) {
      console.log("calling createOrUpdate");
      console.log(item);
      if (item._id) {
        return item.$update(onSuccess, onError);
      } else {
        return item.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(item) {
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

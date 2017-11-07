(function () {
  'use strict';

angular
    .module('core')
    .factory('TransferService', TransferService);

  // This transfers data from one page to another
  function TransferService() {
    var savedAlternativeData = {};

    function setAlternatives(altData) {
      savedAlternativeData = altData;
    }

    function getAlternatives() {
      return savedAlternativeData;
    }

    return {
      setAlternatives: setAlternatives,
      getAlternatives: getAlternatives
    }
  }
}());
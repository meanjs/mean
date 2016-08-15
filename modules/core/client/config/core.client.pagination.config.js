(function () {
  'use strict';

  angular
    .module('core')
    .run(paginationConfig);

  paginationConfig.$inject = ['uibPaginationConfig', '$filter', '$rootScope', 'tmhDynamicLocale'];

  function paginationConfig(uibPaginationConfig, $filter, $rootScope, tmhDynamicLocale) {

    var $translate = $filter('translate');

    $rootScope.$on('$translateChangeSuccess', function () {
      uibPaginationConfig.firstText = $translate('Pagination.First');
      uibPaginationConfig.lastText = $translate('Pagination.Last');
      uibPaginationConfig.previousText = $translate('Pagination.Previous');
      uibPaginationConfig.nextText = $translate('Pagination.Next');
    });

  }
}());

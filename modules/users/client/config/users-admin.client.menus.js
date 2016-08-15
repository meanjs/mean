(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  // Configuring the Users module
  function menuConfig(menuService, $translate) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
    $translate('Manage Users');
  }
}());

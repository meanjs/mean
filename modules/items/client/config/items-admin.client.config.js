(function () {
  'use strict';

  // Configuring the Items Admin module
  angular
    .module('items.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Items',
      state: 'admin.items.list'
    });
  }
}());

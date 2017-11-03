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
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Categories',
      state: 'admin.items.categories'
    });
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Modules',
      state: 'admin.items.modules'
    });
  }
}());

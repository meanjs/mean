(function () {
  'use strict';

  angular
    .module('settings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Settings',
      state: 'settings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'settings', {
      title: 'List Settings',
      state: 'settings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'settings', {
      title: 'Create Setting',
      state: 'settings.create',
      roles: ['user']
    });
  }
}());

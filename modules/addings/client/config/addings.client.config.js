(function () {
  'use strict';

  angular
    .module('addings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Addings',
      state: 'addings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'addings', {
      title: 'List Addings',
      state: 'addings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'addings', {
      title: 'Create Adding',
      state: 'addings.create',
      roles: ['user']
    });
  }
}());

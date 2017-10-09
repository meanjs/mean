(function () {
  'use strict';

  angular
    .module('options')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Options',
      state: 'options',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'options', {
      title: 'List Options',
      state: 'options.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'options', {
      title: 'Create Option',
      state: 'options.create',
      roles: ['user']
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('customizings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Customizings',
      state: 'customizings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'customizings', {
      title: 'List Customizings',
      state: 'customizings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'customizings', {
      title: 'Create Customizing',
      state: 'customizings.create',
      roles: ['user']
    });
  }
}());

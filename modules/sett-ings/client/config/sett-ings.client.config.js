(function () {
  'use strict';

  angular
    .module('sett-ings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sett ings',
      state: 'sett-ings',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sett-ings', {
      title: 'List Sett ings',
      state: 'sett-ings.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sett-ings', {
      title: 'Create Sett ing',
      state: 'sett-ings.create',
      roles: ['user']
    });
  }
}());

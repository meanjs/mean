(function () {
  'use strict';

  angular
    .module('imagegalleries')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Imagegalleries',
      state: 'imagegalleries',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'imagegalleries', {
      title: 'List Imagegalleries',
      state: 'imagegalleries.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'imagegalleries', {
      title: 'Create Imagegallery',
      state: 'imagegalleries.create',
      roles: ['user']
    });
  }
}());

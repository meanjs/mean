(function () {
  'use strict';

  angular
    .module('recipedetails')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Recipedetails',
      state: 'recipedetails',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'recipedetails', {
      title: 'List Recipedetails',
      state: 'recipedetails.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'recipedetails', {
      title: 'Create Recipedetail',
      state: 'recipedetails.create',
      roles: ['user']
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('users')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Users',
      state: 'users',
      type: 'dropdown',
      roles: ['superta', 'ta']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'users', {
      title: 'List Users',
      state: 'users',
      roles: ['superta', 'ta']
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // for the user
    menuService.addMenu('account', {
      roles: ['user']
    });

    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });

    // for the sponsor
    menuService.addMenu('sponsor-account', {
      roles: ['user']
    });

    menuService.addMenuItem('sponsor-account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('sponsor-account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });

    // for the admin
    menuService.addMenu('admin-account', {
      roles: ['user']
    });

    menuService.addMenuItem('admin-account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('admin-account', 'settings', {
      title: 'Add User',
      state: 'settings.password'
    });

    menuService.addSubMenuItem('admin-account', 'settings', {
      title: 'Remove User',
      state: 'settings.password'
    });

    menuService.addSubMenuItem('admin-account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });
  }
}());

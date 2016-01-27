(function () {
  'use strict';

  angular
  .module('core')
  .run(MenuConfig);

  MenuConfig.$inject = ['Menus'];

  function MenuConfig(Menus) {

    Menus.addMenu('account', {
      roles: ['user']
    });

    Menus.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      icon: 'fa-edit',
      state: 'settings.profile'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile Picture',
      icon: 'fa-camera',
      state: 'settings.picture'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      icon: 'fa-key',
      state: 'settings.password'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Manage Social Accounts',
      icon: 'fa-users',
      state: 'settings.accounts'
    });

  }

})();

'use strict';

// Configuring the Replies module
angular.module('replies').run(['Menus',
  function (Menus) {
    // // Add the replies dropdown item
    // Menus.addMenuItem('topbar', {
    //   title: 'Replies',
    //   state: 'replies',
    //   type: 'dropdown',
    //   roles: ['*']
    // });

    // // Add the dropdown list item
    // Menus.addSubMenuItem('topbar', 'replies', {
    //   title: 'List Replies',
    //   state: 'replies.list'
    // });

    // // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'replies', {
    //   title: 'Create Replies',
    //   state: 'replies.create',
    //   roles: ['user']
    // });
  }
]);

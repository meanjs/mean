(function () {
  'use strict';

  angular
    .module('chat')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', '$translate'];

  function menuConfig(menuService, $translate) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Chat',
      state: 'chat'
    });
    $translate('Chat');
  }
}());

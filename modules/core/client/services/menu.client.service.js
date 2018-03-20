((() => {
  angular
    .module('core')
    .factory('menuService', menuService);

  function menuService() {
    let shouldRender;
    const service = {
      addMenu,
      addMenuItem,
      addSubMenuItem,
      defaultRoles: ['user', 'admin'],
      getMenu,
      menus: {},
      removeMenu,
      removeMenuItem,
      removeSubMenuItem,
      validateMenuExistence
    };

    init();

    return service;

    // Add new menu object by menu id
    function addMenu(menuId, options) {
      options = options || {};

      // Create the new menu
      service.menus[menuId] = {
        roles: options.roles || service.defaultRoles,
        items: options.items || [],
        shouldRender
      };

      // Return the menu object
      return service.menus[menuId];
    }

    // Add menu item object
    function addMenuItem(menuId, options) {
      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      options = options || {};

      // Push new menu item
      service.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? service.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender
      });

      // Add submenu items
      if (options.items) {
        options.items.forEach(subMenuItem => {
          service.addSubMenuItem(menuId, options.state, subMenuItem);
        });
      }

      // Return the menu object
      return service.menus[menuId];
    }

    // Add submenu item object
    function addSubMenuItem(menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      // Search for menu item
      service.menus[menuId].items.filter(item => item.state === parentItemState).forEach(item => {
        item.items.push({
          title: options.title || '',
          state: options.state || '',
          params: options.params || {},
          roles: ((options.roles === null || typeof options.roles === 'undefined') ? item.roles : options.roles),
          position: options.position || 0,
          shouldRender
        });
      });

      // Return the menu object
      return service.menus[menuId];
    }

    // Get the menu object by menu id
    function getMenu(menuId) {
      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      // Return the menu object
      return service.menus[menuId];
    }

    function init() {
      // A private function for rendering decision
      shouldRender = function (user) {
        if (this.roles.indexOf('*') !== -1) {
          return true;
        }

        if (!user) {
          return false;
        }

        const matchingRoles = user.roles.filter(function (userRole) {
          return this.roles.indexOf(userRole) !== -1;
        }, this);

        return matchingRoles.length > 0;
      };

      // Adding the topbar menu
      addMenu('topbar', {
        roles: ['*']
      });
    }

    // Remove existing menu object by menu id
    function removeMenu(menuId) {
      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      delete service.menus[menuId];
    }

    // Remove existing menu object by menu id
    function removeMenuItem(menuId, menuItemState) {
      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      // Filter out menu items that do not match the current menu item state.
      service.menus[menuId].items = service.menus[menuId].items.filter(item => item.state !== menuItemState);

      // Return the menu object
      return service.menus[menuId];
    }

    // Remove existing menu object by menu id
    function removeSubMenuItem(menuId, subMenuItemState) {
      // Validate that the menu exists
      service.validateMenuExistence(menuId);

      // Filter out sub-menu items that do not match the current subMenuItemState
      service.menus[menuId].items.forEach(parentMenuItem => {
        parentMenuItem.items = parentMenuItem.items.filter(subMenuItem => subMenuItem.state !== subMenuItemState);
      });

      // Return the menu object
      return service.menus[menuId];
    }

    // Validate menu existence
    function validateMenuExistence(menuId) {
      if (!(menuId && menuId.length)) {
        throw new Error('MenuId was not provided');
      }
      if (!service.menus[menuId]) {
        throw new Error('Menu does not exist');
      }
      return true;
    }
  }
})());

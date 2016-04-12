'use strict';

(function() {
  describe('Menus', function() {
    // Initialize global variables
    var scope,
      menuService;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function(_menuService_) {
      menuService = _menuService_;
    }));

    it('should have topbar added', function() {
      expect(menuService.menus.topbar).toBeDefined();
    });

    it('should have default roles to user and admin', function() {
      expect(menuService.defaultRoles).toEqual(['user', 'admin']);
    });

    describe('addMenu', function() {
      describe('with no options', function() {
        var menuId = 'menu1',
          menu;
        beforeEach(function() {
          menu = menuService.addMenu(menuId);
        });

        it('should return menu object', function() {
          expect(menu).toBeDefined();
        });

        it('should default roles', function() {
          expect(menu.roles).toEqual(menuService.defaultRoles);
        });

        it('should have empty items', function() {
          expect(menu.items).toEqual([]);
        });

        it('should set shouldRender to shouldRender function handle', function() {
          expect(menu.shouldRender()).toBeFalsy();
        });
      });

      describe('with options', function() {
        var menu,
          options = {
            roles: ['a', 'b', 'c'],
            items: ['d', 'e', 'f']
          };
        beforeEach(function() {
          menu = menuService.addMenu('menu1', options);
        });

        it('should set items to options.items list', function() {
          expect(menu.items).toBe(options.items);
        });

        it('should set roles to options.roles list', function() {
          expect(menu.roles).toBe(options.roles);
        });
      });
    });

    describe('shouldRender', function() {
      var menuOptions = {
          roles: ['*', 'menurole']
        },
        menu;
      beforeEach(function() {
        menu = menuService.addMenu('menu1', menuOptions);
      });

      describe('when logged out', function() {
        it('should render if menu is public', function() {
          expect(menu.shouldRender()).toBeTruthy();
        });

        it('should not render if menu is private', function() {
          menu = menuService.addMenu('menu1', {
            isPublic: false
          });
          expect(menu.shouldRender()).toBeFalsy();
        });
      });

      describe('when logged in', function() {
        var user = {
          roles: ['1', 'menurole', '2']
        };
        describe('menu with * role', function() {
          it('should render', function() {
            expect(menu.shouldRender(user)).toBeTruthy();
          });
        });

        describe('menu without * role', function() {
          beforeEach(function() {
            menu = menuService.addMenu('menu1', {
              roles: ['b', 'menurole', 'c']
            });
          });

          it('should render if user has same role as menu', function() {
            expect(menu.shouldRender(user)).toBeTruthy();
          });

          it('should not render if user has different roles', function() {
            user = {
              roles: ['1', '2', '3']
            };
            expect(menu.shouldRender(user)).toBeFalsy();
          });
        });
      });
    });

    describe('validateMenuExistance', function() {
      describe('when menuId not provided', function() {
        it('should throw menuId error', function() {
          expect(menuService.validateMenuExistance).toThrowError('MenuId was not provided');
        });
      });

      describe('when menu does not exist', function() {
        it('should throw no menu error', function() {
          var target = function() {
            menuService.validateMenuExistance('noMenuId');
          };
          expect(target).toThrowError('Menu does not exist');
        });
      });

      describe('when menu exists', function() {
        var menuId = 'menuId';
        beforeEach(function() {
          menuService.menus[menuId] = {};
        });

        it('should return truthy', function() {
          expect(menuService.validateMenuExistance(menuId)).toBeTruthy();
        });
      });
    });

    describe('removeMenu', function() {
      var menu = {
        id: 'menuId'
      };
      beforeEach(function() {
        menuService.menus[menu.id] = menu;
        menuService.validateMenuExistance = jasmine.createSpy();
        menuService.removeMenu(menu.id);
      });

      it('should remove existing menu from menus', function() {
        expect(menuService.menus).not.toContain(menu.id);
      });

      it('validates menu existance before removing', function() {
        expect(menuService.validateMenuExistance).toHaveBeenCalledWith(menu.id);
      });
    });

    describe('addMenuItem', function() {
      var menuId = 'menu1',
        subMenuItem1 = {
          title: 'sub1'
        },
        subMenuItem2 = {
          title: 'sub2'
        },
        menuItemOptions = {
          title: 'title',
          state: 'state',
          type: 'type',
          class: 'class',
          isPublic: false,
          roles: ['a', 'b'],
          position: 2,
          items: [subMenuItem1, subMenuItem2]
        },
        menu,
        menuItem;

      beforeEach(function() {
        menuService.validateMenuExistance = jasmine.createSpy();
        menuService.addSubMenuItem = jasmine.createSpy();
        menuService.addMenu(menuId, {
          roles: ['a', 'b']
        });
        menu = menuService.addMenuItem(menuId, menuItemOptions);
        menuItem = menu.items[0];
      });

      it('should validate menu existance', function() {
        expect(menuService.validateMenuExistance).toHaveBeenCalledWith(menuId);
      });

      it('should return the menu', function() {
        expect(menu).toBeDefined();
      });

      it('should set menu item shouldRender function', function() {
        expect(menuItem.shouldRender).toBeDefined();
      });

      describe('with options set', function() {
        it('should add menu item to menu', function() {
          expect(menu.items.length).toBe(1);
        });

        it('should set menu item title to options title', function() {
          expect(menuItem.title).toBe(menuItemOptions.title);
        });

        it('should set menu item state to options state', function() {
          expect(menuItem.state).toBe(menuItemOptions.state);
        });

        it('should set menu item type to options type', function() {
          expect(menuItem.type).toBe(menuItemOptions.type);
        });

        it('should set menu item class to options class', function() {
          expect(menuItem.class).toBe(menuItemOptions.class);
        });

        it('should set menu item position to options position', function() {
          expect(menuItem.position).toBe(menuItemOptions.position);
        });

        it('should call addSubMenuItem for each item in options', function() {
          expect(menuService.addSubMenuItem).toHaveBeenCalledWith(menuId, menuItemOptions.state, subMenuItem1);
          expect(menuService.addSubMenuItem).toHaveBeenCalledWith(menuId, menuItemOptions.state, subMenuItem2);
        });
      });

      describe('without options set', function() {
        beforeEach(function() {
          menu = menuService.addMenuItem(menuId);
          menuItem = menu.items[1];
        });

        it('should set menu item type to item', function() {
          expect(menuItem.type).toBe('item');
        });

        it('should set menu item title to empty', function() {
          expect(menuItem.title).toBe('');
        });

        it('should set menu item isPublic to false', function() {
          expect(menuItem.isPublic).toBeFalsy();
        });

        it('should set menu item roles to default roles', function() {
          expect(menuItem.roles).toEqual(menuService.defaultRoles);
        });

        it('should set menu item position to 0', function() {
          expect(menuItem.position).toBe(0);
        });
      });
    });

    describe('removeMenuItem', function() {
      var menuId = 'menuId',
        menuItemState = 'menu.state1',
        menuItemState2 = 'menu.state2',
        menu;

      beforeEach(function() {
        menuService.addMenu(menuId);
        menuService.addMenuItem(menuId, { state: menuItemState });
        menuService.addMenuItem(menuId, { state: menuItemState2 });
        menuService.validateMenuExistance = jasmine.createSpy();
        menu = menuService.removeMenuItem(menuId, menuItemState);
      });

      it('should return menu object', function() {
        expect(menu).not.toBeNull();
      });

      it('should validate menu existance', function() {
        expect(menuService.validateMenuExistance).toHaveBeenCalledWith(menuId);
      });

      it('should remove sub menu items with same state', function() {
        expect(menu.items.length).toBe(1);
        expect(menu.items[0].state).toBe(menuItemState2);
      });
    });

    describe('addSubMenuItem', function() {
      var subItemOptions = {
        title: 'title',
        state: 'sub.state',
        params: { p1: 'val1' },
        isPublic: false,
        roles: ['a', 'b'],
        position: 4
      };
      var menuId = 'menu1',
        menuItem1Options = {
          state: 'item1.state',
          items: [],
          isPublic: false
        },
        menuItem2Options = {
          state: 'item2.state2',
          items: [],
          isPublic: true,
          roles: ['a']
        },
        menuItem1,
        menuItem2,
        menuItem3,
        subItem1,
        subItem2,
        menu;

      beforeEach(function() {
        menuService.validateMenuExistance = jasmine.createSpy();
        menuService.addMenu(menuId);
        menuService.addMenuItem(menuId, menuItem1Options);
        menuService.addMenuItem(menuId, menuItem2Options);
        menuService.addMenuItem(menuId, { state: 'something.else' });
        menuService.addSubMenuItem(menuId, menuItem1Options.state, subItemOptions);
        menu = menuService.addSubMenuItem(menuId, menuItem1Options.state);
        menuItem1 = menu.items[0];
        menuItem2 = menu.items[1];
        menuItem3 = menu.items[2];
        subItem1 = menuItem1.items[0];
        subItem2 = menuItem1.items[1];
      });

      afterEach(function() {
        menuService.removeMenu(menuId);
      });

      it('should return menu object', function() {
        expect(menu).not.toBeNull();
      });

      it('should validate menu existance', function() {
        expect(menuService.validateMenuExistance).toHaveBeenCalledWith(menuId);
      });

      it('should not add sub menu item to menu item of different state', function() {
        expect(menuItem3.items.length).toBe(0);
      });

      it('should set shouldRender', function() {
        expect(subItem1.shouldRender).toBeDefined();
      });

      describe('with options set', function() {
        it('should add sub menu item to menu item', function() {
          expect(subItem1).toBeDefined();
        });

        it('should set title to options title', function() {
          expect(subItem1.title).toBe(subItemOptions.title);
        });

        it('should set state to options state', function() {
          expect(subItem1.state).toBe(subItemOptions.state);
        });

        it('should set roles to options roles', function() {
          expect(subItem1.roles).toEqual(subItemOptions.roles);
        });

        it('should set position to options position', function() {
          expect(subItem1.position).toEqual(subItemOptions.position);
        });

        it('should set params to options params', function() {
          expect(subItem1.params).toEqual(subItemOptions.params);
        });
      });

      describe('without optoins set', function() {
        it('should add sub menu item to menu item', function() {
          expect(subItem2).toBeDefined();
        });

        it('should set isPublic to parent isPublic', function() {
          expect(subItem2.isPublic).toBe(menuItem1.isPublic);
        });

        it('should set title to blank', function() {
          expect(subItem2.title).toBe('');
        });

        it('should set state to blank', function() {
          expect(subItem2.state).toBe('');
        });

        it('should set roles to parent roles', function() {
          expect(subItem2.roles).toEqual(menuItem1.roles);
        });

        it('should set position to 0', function() {
          expect(subItem2.position).toBe(0);
        });
      });

      describe('then removeSubMenuItem', function() {
        beforeEach(function() {
          menuService.validateMenuExistance = jasmine.createSpy();
          menu = menuService.removeSubMenuItem(menuId, subItem1.state);
        });

        it('should validate menu existance', function() {
          expect(menuService.validateMenuExistance).toHaveBeenCalledWith(menuId);
        });

        it('should return menu object', function() {
          expect(menu).toBeDefined();
        });

        it('should remove sub menu item', function() {
          expect(menuItem1.items.length).toBe(1);
          expect(menuItem1.items[0].state).toEqual(subItem2.state);
        });
      });
    });
  });
}());

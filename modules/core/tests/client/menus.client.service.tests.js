'use strict';

(function() {
  describe('Menus', function() {
    //Initialize global variables
    var scope,
      Menus;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function(_Menus_) {
      Menus = _Menus_;
    }));

    it('should have topbar added', function() {
      expect(Menus.menus.topbar).toBeDefined();
    });

    it('should have default roles to user and admin', function() {
      expect(Menus.defaultRoles).toEqual(['user', 'admin']);
    });

    describe('addMenu', function() {
      describe('with no options', function() {
        var menuId = 'menu1',
          menu;
        beforeEach(function() {
          menu = Menus.addMenu(menuId);
        });

        it('should return menu object', function() {
          expect(menu).toBeDefined();
        });

        it('should default roles', function() {
          expect(menu.roles).toEqual(Menus.defaultRoles);
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
          menu = Menus.addMenu('menu1', options);
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
        menu = Menus.addMenu('menu1', menuOptions);
      });

      describe('when logged out', function() {
        it('should render if menu is public', function() {
          expect(menu.shouldRender()).toBeTruthy();
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
            menu = Menus.addMenu('menu1', {
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
          expect(Menus.validateMenuExistance).toThrowError('MenuId was not provided');
        });
      });

      describe('when menu does not exist', function() {
        it('should throw no menu error', function() {
          var target = function() {
            Menus.validateMenuExistance('noMenuId');
          };
          expect(target).toThrowError('Menu does not exist');
        });
      });

      describe('when menu exists', function() {
        var menuId = 'menuId';
        beforeEach(function() {
          Menus.menus[menuId] = {};
        });

        it('should return truthy', function() {
          expect(Menus.validateMenuExistance(menuId)).toBeTruthy();
        });
      });
    });

    describe('removeMenu', function() {
      var menu = {
        id: 'menuId'
      };
      beforeEach(function() {
        Menus.menus[menu.id] = menu;
        Menus.validateMenuExistance = jasmine.createSpy();
        Menus.removeMenu(menu.id);
      });

      it('should remove existing menu from menus', function() {
        expect(Menus.menus).not.toContain(menu.id);
      });

      it('validates menu existance before removing', function() {
        expect(Menus.validateMenuExistance).toHaveBeenCalledWith(menu.id);
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
          link: 'link',
          position: 2,
          items: [subMenuItem1, subMenuItem2]
        },
        menu,
        menuItem;

      beforeEach(function() {
        Menus.validateMenuExistance = jasmine.createSpy();
        Menus.addSubMenuItem = jasmine.createSpy();
        Menus.addMenu(menuId, {
          roles: ['a', 'b']
        });
        menu = Menus.addMenuItem(menuId, menuItemOptions);
        menuItem = menu.items[0];
      });

      it('should validate menu existance', function() {
        expect(Menus.validateMenuExistance).toHaveBeenCalledWith(menuId);
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
          expect(Menus.addSubMenuItem).toHaveBeenCalledWith(menuId, menuItemOptions.link, subMenuItem1);
          expect(Menus.addSubMenuItem).toHaveBeenCalledWith(menuId, menuItemOptions.link, subMenuItem2);
        });
      });

      describe('without options set', function() {
        beforeEach(function() {
          menu = Menus.addMenuItem(menuId);
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
          expect(menuItem.roles).toEqual(Menus.defaultRoles);
        });

        it('should set menu item position to 0', function() {
          expect(menuItem.position).toBe(0);
        });
      });
    });

    describe('removeMenuItem', function() {
      var menuId = 'menuId',
        menuItemURL = 'url',
        menuItem1 = {
          link: menuItemURL
        },
        menuItem2 = {
          link: ''
        },
        newMenu = {
          items: [menuItem1, menuItem2]
        },
        menu = null;

      beforeEach(function() {
        Menus.menus.menuId = newMenu;
        Menus.validateMenuExistance = jasmine.createSpy();
        menu = Menus.removeMenuItem(menuId, menuItemURL);
      });

      it('should return menu object', function() {
        expect(menu).not.toBeNull();
      });

      it('should validate menu existance', function() {
        expect(Menus.validateMenuExistance).toHaveBeenCalledWith(menuId);
      });

      it('should remove sub menu items with same link', function() {
        expect(menu.items.length).toBe(1);
        expect(menu.items[0]).toBe(menuItem2);
      });
    });

    describe('addSubMenuItem', function() {
      var subItemOptions = {
        title: 'title',
        state: 'state',
        isPublic: false,
        roles: ['a', 'b'],
        position: 4
      };
      var menuId = 'menu1',
        menuItem1 = {
          state: 'state',
          items: [],
          isPublic: false
        },
        menuItem2 = {
          state: 'state2',
          items: [],
          isPublic: true,
          roles: ['a']
        },
        menuItem3 = {
          state: 'state3',
          items: []
        },
        newMenu = {
          items: [menuItem1, menuItem2, menuItem3]
        },
        menu;

      beforeEach(function() {
        Menus.validateMenuExistance = jasmine.createSpy();
        Menus.menus[menuId] = newMenu;
        Menus.addSubMenuItem(menuId, menuItem1.state, subItemOptions);
        menu = Menus.addSubMenuItem(menuId, menuItem2.state);
      });

      afterEach(function() {
        menuItem1.items = [];
        menuItem2.items = [];
      });

      it('should return menu object', function() {
        expect(menu).toEqual(newMenu);
      });

      it('should validate menu existance', function() {
        expect(Menus.validateMenuExistance).toHaveBeenCalledWith(menuId);
      });

      it('should not add sub menu item to menu item of different state', function() {
        expect(menuItem3.items.length).toBe(0);
      });

      it('should set shouldRender', function() {
        expect(menuItem1.items[0].shouldRender).toBeDefined();
      });

      describe('with options set', function() {
        var subMenuItem;
        beforeEach(function() {
          subMenuItem = menuItem1.items[0];
        });

        it('should add sub menu item to menu item', function() {
          expect(menuItem1.items.length).toBe(1);
        });

        it('should set title to options title', function() {
          expect(subMenuItem.title).toBe(subItemOptions.title);
        });

        it('should set state to options state', function() {
          expect(subMenuItem.state).toBe(subItemOptions.state);
        });

        it('should set roles to options roles', function() {
          expect(subMenuItem.roles).toEqual(subItemOptions.roles);
        });

        it('should set position to options position', function() {
          expect(subMenuItem.position).toEqual(subItemOptions.position);
        });
      });

      describe('without optoins set', function() {
        var subMenuItem;
        beforeEach(function() {
          subMenuItem = menuItem2.items[0];
        });

        it('should add sub menu item to menu item', function() {
          expect(menuItem2.items.length).toBe(1);
        });

        it('should set title to blank', function() {
          expect(subMenuItem.title).toBe('');
        });

        it('should set state to blank', function() {
          expect(subMenuItem.state).toBe('');
        });

        it('should set roles to parent roles', function() {
          expect(subMenuItem.roles).toEqual(menuItem2.roles);
        });

        it('should set position to 0', function() {
          expect(subMenuItem.position).toBe(0);
        });
      });
    });

    describe('removeSubMenuItem', function() {
      var menuId = 'menu1',
        subMenuItem1 = {
          link: 'link1'
        },
        subMenuItem2 = {
          link: 'link2'
        },
        menuItem1 = {
          state: 'state',
          items: [subMenuItem1, subMenuItem2],
        },
        menuItem2 = {
          state: 'state2',
          items: [],
        },
        newMenu = {
          items: [menuItem1, menuItem2]
        },
        menu;
      beforeEach(function() {
        Menus.validateMenuExistance = jasmine.createSpy();
        Menus.menus[menuId] = newMenu;
        menu = Menus.removeSubMenuItem(menuId, subMenuItem1.link);
      });

      it('should validate menu existance', function() {
        expect(Menus.validateMenuExistance).toHaveBeenCalledWith(menuId);
      });

      it('should return menu object', function() {
        expect(menu).toEqual(newMenu);
      });

      it('should remove sub menu item', function() {
        expect(menuItem1.items.length).toBe(1);
        expect(menuItem1.items[0]).toEqual(subMenuItem2);
      });
    });
  });
})();

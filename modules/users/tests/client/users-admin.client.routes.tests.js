((() => {
  describe('Users Admin Route Tests', () => {
    // Initialize global variables
    var $scope;

    var Authentication;
    var $httpBackend;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(($rootScope, _Authentication_) => {
      // Set a new global scope
      $scope = $rootScope.$new();
      Authentication = _Authentication_;
    }));

    describe('Route Config', () => {
      describe('Main Route', () => {
        var mainstate;
        beforeEach(inject($state => {
          mainstate = $state.get('admin.users');
        }));

        it('Should have the correct URL', () => {
          expect(mainstate.url).toEqual('/users');
        });

        it('Should not be abstract', () => {
          expect(mainstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(mainstate.templateUrl).toBe('/modules/users/client/views/admin/list-users.client.view.html');
        });
      });

      describe('View Route', () => {
        var viewstate;
        beforeEach(inject($state => {
          viewstate = $state.get('admin.user');
        }));

        it('Should have the correct URL', () => {
          expect(viewstate.url).toEqual('/users/:userId');
        });

        it('Should not be abstract', () => {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(viewstate.templateUrl).toBe('/modules/users/client/views/admin/view-user.client.view.html');
        });
      });

      describe('Edit Route', () => {
        var editstate;
        beforeEach(inject($state => {
          editstate = $state.get('admin.user-edit');
        }));

        it('Should have the correct URL', () => {
          expect(editstate.url).toEqual('/users/:userId/edit');
        });

        it('Should not be abstract', () => {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(editstate.templateUrl).toBe('/modules/users/client/views/admin/edit-user.client.view.html');
        });
      });

      describe('Handle Trailing Slash', () => {
        beforeEach(inject(($state, $rootScope, _Authentication_, _$httpBackend_) => {
          Authentication.user = {
            name: 'user',
            roles: ['admin']
          };

          $httpBackend = _$httpBackend_;

          // Ignore parent template gets on state transition
          $httpBackend.whenGET('/modules/users/client/views/admin/list-users.client.view.html').respond(200);
          $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200);

          $state.go('admin.users');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(($state, $location, $rootScope, $templateCache) => {
          $templateCache.put('/modules/users/client/views/admin/list-users.client.view.html', '');
          $templateCache.put('/modules/core/client/views/home.client.view.html', '');

          $location.path('admin/users/');
          $rootScope.$digest();

          expect($location.path()).toBe('/admin/users');
          expect($state.current.templateUrl).toBe('/modules/users/client/views/admin/list-users.client.view.html');
        }));
      });

    });
  });
})());

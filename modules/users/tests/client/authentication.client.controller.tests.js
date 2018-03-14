((() => {
  // Authentication controller Spec
  describe('AuthenticationController', () => {
    // Initialize global variables
    var AuthenticationController,
      scope,
      $httpBackend,
      $stateParams,
      $state,
      $location,
      Notification;

    beforeEach(() => {
      jasmine.addMatchers({
        toEqualData(util, customEqualityTesters) {
          return {
            compare(actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    describe('Logged out user', () => {
      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject((
        $controller,
        $rootScope,
        _$location_,
        _$stateParams_,
        _$httpBackend_,
        _Notification_
      ) => {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        Notification = _Notification_;

        // Spy on Notification
        spyOn(Notification, 'error');
        spyOn(Notification, 'success');

        // Ignore parent template get on state transitions
        $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200);
        $httpBackend.whenGET('/modules/core/client/views/400.client.view.html').respond(200);

        // Initialize the Authentication controller
        AuthenticationController = $controller('AuthenticationController as vm', {
          $scope: scope
        });
      }));

      describe('$scope.signin()', () => {
        it('should login with a correct user and password', inject($templateCache => {
          $templateCache.put('/modules/core/client/views/home.client.view.html', '');

          // Test expected GET request
          $httpBackend.when('POST', '/api/auth/signin').respond(200, { username: 'Fred' });

          scope.vm.signin(true);
          $httpBackend.flush();

          // Test scope value
          expect(scope.vm.authentication.user.username).toEqual('Fred');
          expect($location.url()).toEqual('/');
        }));

        it('should login with a correct email and password', inject($templateCache => {
          $templateCache.put('/modules/core/client/views/home.client.view.html', '');
          // Test expected GET request
          $httpBackend.when('POST', '/api/auth/signin').respond(200, { email: 'Fred@email.com' });

          scope.vm.signin(true);
          $httpBackend.flush();

          // Test scope value
          expect(scope.vm.authentication.user.email).toEqual('Fred@email.com');
          expect($location.url()).toEqual('/');
        }));

        it('should be redirected to previous state after successful login',
          inject(_$state_ => {
            $state = _$state_;
            $state.previous = {
              state: {
                name: 'articles.create'
              },
              params: {},
              href: '/articles/create'
            };

            spyOn($state, 'transitionTo');
            spyOn($state, 'go');

            // Test expected GET request
            $httpBackend.when('POST', '/api/auth/signin').respond(200, 'Fred');

            scope.vm.signin(true);
            $httpBackend.flush();

            // Test scope value
            expect($state.go).toHaveBeenCalled();
            expect($state.go).toHaveBeenCalledWith($state.previous.state.name, $state.previous.params);

          }));

        it('should fail to log in with nothing', () => {
          // Test expected POST request
          $httpBackend.expectPOST('/api/auth/signin').respond(400, {
            'message': 'Missing credentials'
          });

          scope.vm.signin(true);
          $httpBackend.flush();

          // Test Notification.error is called
          expect(Notification.error).toHaveBeenCalledWith({ message: 'Missing credentials', title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
        });

        it('should fail to log in with wrong credentials', () => {
          // Foo/Bar combo assumed to not exist
          scope.vm.authentication.user = { username: 'Foo' };
          scope.vm.credentials = 'Bar';

          // Test expected POST request
          $httpBackend.expectPOST('/api/auth/signin').respond(400, {
            'message': 'Unknown user'
          });

          scope.vm.signin(true);
          $httpBackend.flush();

          // Test Notification.error is called
          expect(Notification.error).toHaveBeenCalledWith({ message: 'Unknown user', title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
        });
      });

      describe('$scope.signup()', () => {
        it('should register with correct data', inject($templateCache => {
          $templateCache.put('/modules/core/client/views/home.client.view.html', '');

          // Test expected GET request
          scope.vm.authentication.user = 'Fred';
          $httpBackend.when('POST', '/api/auth/signup').respond(200, { username: 'Fred' });

          scope.vm.signup(true);
          $httpBackend.flush();

          // test scope value
          expect(scope.vm.authentication.user.username).toBe('Fred');
          expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
          expect($location.url()).toBe('/');
        }));

        it('should fail to register with duplicate Username', () => {
          // Test expected POST request
          $httpBackend.when('POST', '/api/auth/signup').respond(400, {
            'message': 'Username already exists'
          });

          scope.vm.signup(true);
          $httpBackend.flush();

          // Test Notification.error is called
          expect(Notification.error).toHaveBeenCalledWith({ message: 'Username already exists', title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
        });
      });
    });

    describe('Logged in user', () => {
      beforeEach(inject(($controller, $rootScope, _$location_, _Authentication_) => {
        scope = $rootScope.$new();

        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);

        // Mock logged in user
        _Authentication_.user = {
          username: 'test',
          roles: ['user']
        };

        AuthenticationController = $controller('AuthenticationController as vm', {
          $scope: scope
        });
      }));

      it('should be redirected to home', () => {
        expect($location.path).toHaveBeenCalledWith('/');
      });
    });
  });
})());

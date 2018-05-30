(() => {
  // Password controller Spec
  describe('PasswordController', () => {
    // Initialize global variables
    let PasswordController;

    let scope;
    let $httpBackend;
    let $stateParams;
    let $location;
    let $window;
    let Notification;

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

    describe('Logged in user', () => {
      beforeEach(inject((
        $controller,
        $rootScope,
        _UsersService_,
        _Authentication_,
        _$stateParams_,
        _$httpBackend_,
        _$location_
      ) => {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);

        // Ignore parent template gets on state transition
        $httpBackend.whenGET('/modules/core/client/views/404.client.view.html').respond(200);

        // Mock logged in user
        _Authentication_.user = {
          username: 'test',
          roles: ['user']
        };

        // Initialize the Authentication controller
        PasswordController = $controller('PasswordController as vm', {
          $scope: scope
        });
      }));

      it('should redirect logged in user to home', () => {
        expect($location.path).toHaveBeenCalledWith('/');
      });
    });

    describe('Logged out user', () => {
      beforeEach(inject((
        $controller,
        $rootScope,
        _$window_,
        _$stateParams_,
        _$httpBackend_,
        _$location_,
        _Notification_
      ) => {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);
        $window = _$window_;
        $window.user = null;
        Notification = _Notification_;

        spyOn(Notification, 'error');
        spyOn(Notification, 'success');

        // Ignore parent template gets on state transition
        $httpBackend.whenGET('/modules/core/client/views/404.client.view.html').respond(200);
        $httpBackend.whenGET('/modules/core/client/views/400.client.view.html').respond(200);

        // Initialize the Authentication controller
        PasswordController = $controller('PasswordController as vm', {
          $scope: scope
        });
      }));

      it('should not redirect to home', () => {
        expect($location.path).not.toHaveBeenCalledWith('/');
      });

      describe('askForPasswordReset', () => {
        const credentials = {
          username: 'test',
          password: 'P@ssw0rd!!'
        };
        beforeEach(() => {
          scope.vm.credentials = credentials;
        });

        describe('POST error', () => {
          const errorMessage = 'No account with that username has been found';
          beforeEach(() => {
            $httpBackend.when('POST', '/api/auth/forgot', credentials).respond(400, {
              'message': errorMessage
            });

            scope.vm.askForPasswordReset(true);
            $httpBackend.flush();
          });

          it('should clear form', () => {
            expect(scope.vm.credentials).toBe(null);
          });

          it('should call Notification.error with response message', () => {
            expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Failed to send password reset email!', delay: 4000 });
          });
        });

        describe('POST success', () => {
          const successMessage = 'An email has been sent to the provided email with further instructions.';
          beforeEach(() => {
            $httpBackend.when('POST', '/api/auth/forgot', credentials).respond({
              'message': successMessage
            });

            scope.vm.askForPasswordReset(true);
            $httpBackend.flush();
          });

          it('should clear form', () => {
            expect(scope.vm.credentials).toBe(null);
          });

          it('should call Notification.success with response message', () => {
            expect(Notification.success).toHaveBeenCalledWith({ message: successMessage, title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!' });
          });
        });
      });

      describe('resetUserPassword', () => {
        const token = 'testToken';
        const passwordDetails = {
          password: 'test'
        };
        beforeEach(() => {
          $stateParams.token = token;
          scope.vm.passwordDetails = passwordDetails;
        });

        it('POST error should call Notification.error with response message', () => {
          const errorMessage = 'Passwords do not match';
          $httpBackend.when('POST', '/api/auth/reset/' + token, passwordDetails).respond(400, {
            'message': errorMessage
          });

          scope.vm.resetUserPassword(true);
          $httpBackend.flush();

          expect(Notification.error).toHaveBeenCalledWith({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Password reset failed!', delay: 4000 });
        });

        describe('POST success', () => {
          const user = {
            username: 'test'
          };
          beforeEach(() => {
            $httpBackend.when('POST', '/api/auth/reset/' + token, passwordDetails).respond(user);

            scope.vm.resetUserPassword(true);
            $httpBackend.flush();
          });

          it('should clear password form', () => {
            expect(scope.vm.passwordDetails).toBe(null);
          });

          it('should attach user profile', () => {
            expect(scope.vm.authentication.user.username).toEqual(user.username);
          });

          it('should redirect to password reset success view with Notification.success', () => {
            expect(Notification.success).toHaveBeenCalledWith({ message: '<i class="glyphicon glyphicon-ok"></i> Password reset successful!' });
            expect($location.path).toHaveBeenCalledWith('/password/reset/success');
          });
        });
      });
    });
  });
})();

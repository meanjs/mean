((() => {
  'use strict';

  describe('Users Route Tests', () => {
    // Initialize global variables
    var $scope,
      Authentication,
      $httpBackend;

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

    describe('Settings Route Config', () => {
      describe('Main Route', () => {
        var mainstate;
        beforeEach(inject($state => {
          mainstate = $state.get('settings');
        }));

        it('Should have the correct URL', () => {
          expect(mainstate.url).toEqual('/settings');
        });

        it('Should be abstract', () => {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have templateUrl', () => {
          expect(mainstate.templateUrl).toBe('/modules/users/client/views/settings/settings.client.view.html');
        });
      });

      describe('Profile Route', () => {
        var profilestate;
        beforeEach(inject($state => {
          profilestate = $state.get('settings.profile');
        }));

        it('Should have the correct URL', () => {
          expect(profilestate.url).toEqual('/profile');
        });

        it('Should not be abstract', () => {
          expect(profilestate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(profilestate.templateUrl).toBe('/modules/users/client/views/settings/edit-profile.client.view.html');
        });
      });

      describe('Password Route', () => {
        var passwordstate;
        beforeEach(inject($state => {
          passwordstate = $state.get('settings.password');
        }));

        it('Should have the correct URL', () => {
          expect(passwordstate.url).toEqual('/password');
        });

        it('Should not be abstract', () => {
          expect(passwordstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(passwordstate.templateUrl).toBe('/modules/users/client/views/settings/change-password.client.view.html');
        });
      });

      describe('Accounts Route', () => {
        var accountsstate;
        beforeEach(inject($state => {
          accountsstate = $state.get('settings.accounts');
        }));

        it('Should have the correct URL', () => {
          expect(accountsstate.url).toEqual('/accounts');
        });

        it('Should not be abstract', () => {
          expect(accountsstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(accountsstate.templateUrl).toBe('/modules/users/client/views/settings/manage-social-accounts.client.view.html');
        });
      });

      describe('Picture Route', () => {
        var picturestate;
        beforeEach(inject($state => {
          picturestate = $state.get('settings.picture');
        }));

        it('Should have the correct URL', () => {
          expect(picturestate.url).toEqual('/picture');
        });

        it('Should not be abstract', () => {
          expect(picturestate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(picturestate.templateUrl).toBe('/modules/users/client/views/settings/change-profile-picture.client.view.html');
        });
      });

      describe('Handle Trailing Slash', () => {
        beforeEach(inject(($state, $rootScope, _Authentication_, _$httpBackend_) => {
          Authentication.user = {
            name: 'user',
            roles: ['user']
          };

          $httpBackend = _$httpBackend_;

          // Ignore parent template gets on state transitions
          $httpBackend.whenGET('/modules/users/client/views/settings/settings.client.view.html').respond(200);
          $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200);
          $httpBackend.whenGET('/modules/users/client/views/settings/edit-profile.client.view.html').respond(200);

          $state.go('settings.profile');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(($state, $location, $rootScope, $templateCache) => {
          $templateCache.put('/modules/users/client/views/settings/settings.client.view.html', '');
          $templateCache.put('/modules/users/client/views/settings/edit-profile.client.view.html', '');

          $location.path('settings/profile/');
          $rootScope.$digest();

          expect($location.path()).toBe('/settings/profile');
          expect($state.current.templateUrl).toBe('/modules/users/client/views/settings/edit-profile.client.view.html');
        }));
      });

    });

    describe('Authentication Route Config', () => {
      describe('Main Route', () => {
        var mainstate;
        beforeEach(inject($state => {
          mainstate = $state.get('authentication');
        }));

        it('Should have the correct URL', () => {
          expect(mainstate.url).toEqual('/authentication');
        });

        it('Should be abstract', () => {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have templateUrl', () => {
          expect(mainstate.templateUrl).toBe('/modules/users/client/views/authentication/authentication.client.view.html');
        });
      });

      describe('Signup Route', () => {
        var signupstate;
        beforeEach(inject($state => {
          signupstate = $state.get('authentication.signup');
        }));

        it('Should have the correct URL', () => {
          expect(signupstate.url).toEqual('/signup');
        });

        it('Should not be abstract', () => {
          expect(signupstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(signupstate.templateUrl).toBe('/modules/users/client/views/authentication/signup.client.view.html');
        });
      });

      describe('Signin Route', () => {
        var signinstate;
        beforeEach(inject($state => {
          signinstate = $state.get('authentication.signin');
        }));

        it('Should have the correct URL', () => {
          expect(signinstate.url).toEqual('/signin?err');
        });

        it('Should not be abstract', () => {
          expect(signinstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(signinstate.templateUrl).toBe('/modules/users/client/views/authentication/signin.client.view.html');
        });
      });

    });

    describe('Password Route Config', () => {
      describe('Main Route', () => {
        var mainstate;
        beforeEach(inject($state => {
          mainstate = $state.get('password');
        }));

        it('Should have the correct URL', () => {
          expect(mainstate.url).toEqual('/password');
        });

        it('Should be abstract', () => {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', () => {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('Forgot Route', () => {
        var forgotstate;
        beforeEach(inject($state => {
          forgotstate = $state.get('password.forgot');
        }));

        it('Should have the correct URL', () => {
          expect(forgotstate.url).toEqual('/forgot');
        });

        it('Should not be abstract', () => {
          expect(forgotstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(forgotstate.templateUrl).toBe('/modules/users/client/views/password/forgot-password.client.view.html');
        });
      });

    });

    describe('Password Reset Route Config', () => {
      describe('Main Route', () => {
        var mainstate;
        beforeEach(inject($state => {
          mainstate = $state.get('password.reset');
        }));

        it('Should have the correct URL', () => {
          expect(mainstate.url).toEqual('/reset');
        });

        it('Should be abstract', () => {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', () => {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('Invalid Route', () => {
        var invalidstate;
        beforeEach(inject($state => {
          invalidstate = $state.get('password.reset.invalid');
        }));

        it('Should have the correct URL', () => {
          expect(invalidstate.url).toEqual('/invalid');
        });

        it('Should not be abstract', () => {
          expect(invalidstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(invalidstate.templateUrl).toBe('/modules/users/client/views/password/reset-password-invalid.client.view.html');
        });
      });

      describe('Success Route', () => {
        var successstate;
        beforeEach(inject($state => {
          successstate = $state.get('password.reset.success');
        }));

        it('Should have the correct URL', () => {
          expect(successstate.url).toEqual('/success');
        });

        it('Should not be abstract', () => {
          expect(successstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(successstate.templateUrl).toBe('/modules/users/client/views/password/reset-password-success.client.view.html');
        });
      });

      describe('Form Route', () => {
        var formstate;
        beforeEach(inject($state => {
          formstate = $state.get('password.reset.form');
        }));

        it('Should have the correct URL', () => {
          expect(formstate.url).toEqual('/:token');
        });

        it('Should not be abstract', () => {
          expect(formstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', () => {
          expect(formstate.templateUrl).toBe('/modules/users/client/views/password/reset-password.client.view.html');
        });
      });

    });
  });
})());

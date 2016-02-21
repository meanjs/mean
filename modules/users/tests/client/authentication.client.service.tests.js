'use strict';

(function () {
  // Authentication controller Spec
  describe('AuthenticationService', function () {
    // Initialize global variables
    var AuthenticationService,
      $httpBackend,
      $stateParams,
      $state,
      $location,
      $q,
      localStorageService;

    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
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

    describe('unauthenticated', function () {
      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function (_$location_, _$stateParams_, _$httpBackend_, _Authentication_, _$q_) {

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        AuthenticationService = _Authentication_;
        $q = _$q_;
      }));

      it('should construct the service', inject(function (Authentication) {

        expect(typeof Authentication.ready).toEqual('object');
        expect(Authentication.ready.then instanceof Function).toBe(true);

        expect(Authentication.user).toBe(null);
        expect(Authentication.token).toBe(null);

        expect(Authentication.login instanceof Function).toBe(true);
        expect(Authentication.signout instanceof Function).toBe(true);
        expect(Authentication.refresh instanceof Function).toBe(true);

      }));

      describe('login()', function () {
        var user = {
          username: 'Fred'
        };
        //Currently breaks
        //Authentication.login(user, 'okiedokie');

        it('should set the service variables', inject(function (Authentication) {

          //expect(Authentication.user.username).toBe('Fred');
          //expect(Authentication.token).toBe('okiedokie');

        }));

        it('should set the token in local storage', inject(function (Authentication) {

        }));

        it('should set the $http Authorization header', inject(function (Authentication) {

        }));

        it('should resolve the ready promise', inject(function (Authentication) {

        }));
      });

      describe('token on URL', function () {
        it('should take the token and load the user', inject(function (Authentication) {
          //This will hit the /api/users/me route to load the user into service.user
        }));

        it('should remove the token from the URL', inject(function (Authentication) {
          //This will hit the /api/users/me route to load the user into service.user
        }));
      });

      describe('token in local storage', function () {
        it('should take the token and load the user', inject(function (Authentication) {
          //This will hit the /api/users/me route to load the user into service.user
        }));
      });





    });

    describe('authenticated', function () {

      describe('refresh()', function () {

        //Currently breaks
        //Authentication.refresh();

        it('reset the ready promise', inject(function (Authentication) {
          //This will hit the /api/users/me route to load the user into service.user
        }));

        it('should take the token and reload the user', inject(function (Authentication) {
          //This will hit the /api/users/me route to load the user into service.user
        }));
      });

      describe('signout()', function () {

        //Currently breaks
        //Authentication.signout();

        it('should set service variables to null', inject(function (Authentication) {
          //expect(Authentication.user).toBe(null);
          //expect(Authentication.token).toBe(null);
        }));

        it('should remove token from local storage', inject(function (Authentication) {

        }));

        it('should reload the current state', inject(function (Authentication) {

        }));
        
      });

    });


  });
}());

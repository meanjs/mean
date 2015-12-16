'use strict';

(function() {
  describe('authInterceptor', function() {
    //Initialize global variables
    var authInterceptor,
      $q,
      $state,
      Authentication,
      httpProvider;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    //Load httpProvider
    beforeEach(module(function($httpProvider) {
      httpProvider = $httpProvider;
    }));

    beforeEach(inject(function(_authInterceptor_, _$q_, _$state_, _Authentication_) {
      authInterceptor = _authInterceptor_;
      $q = _$q_;
      $state = _$state_;
      Authentication = _Authentication_;
      spyOn($q,'reject');
      spyOn($state,'transitionTo');
    }));

    it('Auth Interceptor should be object', function() {
      expect(typeof authInterceptor).toEqual('object');
    });

    it('Auth Interceptor should contain responseError function', function() {
      expect(typeof authInterceptor.responseError).toEqual('function');
    });

    it('httpProvider Interceptor should have authInterceptor', function() {
      expect(httpProvider.interceptors).toContain('authInterceptor');
    });

    describe('Forbidden Interceptor', function() {
      it('should redirect to forbidden route', function () {
        var response = {
          status: 403,
          config: {}
        };
        var promise = authInterceptor.responseError(response);
        expect($q.reject).toHaveBeenCalled();
        expect($state.transitionTo).toHaveBeenCalledWith('forbidden');
      });
    });

    describe('Authorization Interceptor', function() {
      it('should redirect to signIn page for unauthorized access', function () {
        var response = {
          status: 401,
          config: {}
        };
        var promise = authInterceptor.responseError(response);
        expect($q.reject).toHaveBeenCalled();
        expect(Authentication.user).toBe(null);
        expect($state.transitionTo).toHaveBeenCalledWith('authentication.signin');
      });
    });
  });
})();

(() => {
  describe('authInterceptor', () => {
    // Initialize global variables
    let authInterceptor;

    let $q;
    let $state;
    let Authentication;
    let httpProvider;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // Load httpProvider
    beforeEach(module($httpProvider => {
      httpProvider = $httpProvider;
    }));

    beforeEach(inject((_authInterceptor_, _$q_, _$state_, _Authentication_) => {
      authInterceptor = _authInterceptor_;
      $q = _$q_;
      $state = _$state_;
      Authentication = _Authentication_;
      spyOn($q, 'reject');
      spyOn($state, 'transitionTo');
    }));

    it('Auth Interceptor should be object', () => {
      expect(typeof authInterceptor).toEqual('object');
    });

    it('Auth Interceptor should contain responseError function', () => {
      expect(typeof authInterceptor.responseError).toEqual('function');
    });

    it('httpProvider Interceptor should have authInterceptor', () => {
      expect(httpProvider.interceptors).toContain('authInterceptor');
    });

    describe('Forbidden Interceptor', () => {
      it('should redirect to forbidden route', () => {
        const response = {
          status: 403,
          config: {}
        };
        const promise = authInterceptor.responseError(response);
        expect($q.reject).toHaveBeenCalled();
        expect($state.transitionTo).toHaveBeenCalledWith('forbidden');
      });
    });

    describe('Authorization Interceptor', () => {
      it('should redirect to signIn page for unauthorized access', () => {
        const response = {
          status: 401,
          config: {}
        };
        const promise = authInterceptor.responseError(response);
        expect($q.reject).toHaveBeenCalled();
        expect(Authentication.user).toBe(null);
        expect($state.transitionTo).toHaveBeenCalledWith('authentication.signin');
      });
    });

    describe('Unresponsive Interceptor', () => {
      let Notification;
      beforeEach(inject(_Notification_ => {
        Notification = _Notification_;
        spyOn(Notification, 'error');
      }));
      it('should show error Notification', () => {
        const response = {
          status: -1,
          config: {}
        };
        const promise = authInterceptor.responseError(response);
        expect($q.reject).toHaveBeenCalled();
        expect(Notification.error).toHaveBeenCalledWith({ message: 'No response received from server. Please try again later.', title: 'Error processing request!', delay: 5000 });
      });
    });
  });
})();

'use strict';

(function() {
  // Password Validator Directive Spec
  describe('PasswordValidatorDirective', function() {
    // Initialize global variables
    var scope,
      element,
      $compile,
      $httpBackend,
      form;

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    beforeEach(inject(function(_$rootScope_, _$compile_, _$httpBackend_) {
      // Set a new global scope
      scope = _$rootScope_.$new();
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;

      $httpBackend.whenGET('api/users/me').respond({});

      scope.passwordMock = {
        password: 'P@ssw0rd!!'
      };
    }));

    function compileDirective(template) {
      // function to compile a fresh directive with the given template, or a default one
      // input form with directive
      if (!template) template = '<input type="password" id="password" name="password" ng-model="passwordMock.password" password-validator required>';
      template = '<form name="form"><div>' + template + '<input type="submit">submit form</input></div></form>';

      // inject allows you to use AngularJS dependency injection
      // to retrieve and use other services
      inject(function($compile) {
        var form = $compile(template)(scope);
        element = form.find('div');

        // $digest is necessary to finalize the directive generation
        scope.$digest();
      });
    }

    describe('Initialize', function() {
      beforeEach(function () {
        compileDirective();
      });

      it('should produce the password input', function () {
        expect(element.find('input').length).toEqual(2);
      });

      it('should check form validity upon initializing', function () {
        expect(scope.form.$valid).toBeTruthy();
      });

    });

    it('should set form to invalid with empty password', function () {
      scope.passwordMock.password = '';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeTruthy();
      expect(scope.requirementsColor).toEqual(undefined);
      expect(scope.requirementsProgress).toEqual(undefined);
    });

    it('should be valid when password meets requirements - "P@ssw0rd!!""', function() {
      scope.passwordMock.password = 'P@ssw0rd!!';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeTruthy();
      expect(scope.form.password.$error).toEqual({});
      expect(scope.requirementsColor).toEqual('success');
      expect(scope.requirementsProgress).toEqual('100');
    });

    it('should be valid when password meets requirements with a passphrase', function() {
      scope.passwordMock.password = 'Open-Source Full-Stack Solution for MEAN';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeTruthy();
      expect(scope.form.password.$error).toEqual({});
      expect(scope.requirementsColor).toEqual('success');
      expect(scope.requirementsProgress).toEqual('100');
    });

    it('should not allow a less than 10 characters long - "P@$$w0rd!"', function() {
      scope.passwordMock.password = 'P@$$w0rd!';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['The password must be at least 10 characters long.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('should not allow a greater than 128 characters long', function() {
      scope.passwordMock.password = ')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['The password must be fewer than 128 characters.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('should not allow more than 3 or more repeating characters - "P@$$w0rd!!!"', function() {
      scope.passwordMock.password = 'P@$$w0rd!!!';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['The password may not contain sequences of three or more repeated characters.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('should not allow a password with no uppercase letters - "p@$$w0rd!!"', function() {
      scope.passwordMock.password = 'p@$$w0rd!!';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['The password must contain at least one uppercase letter.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('should not allow a password with less than one number - "P@$$word!!"', function() {
      scope.passwordMock.password = 'P@$$word!!';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['The password must contain at least one number.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('should not allow a password with less than one special character - "Passw0rdss"', function() {
      scope.passwordMock.password = 'Passw0rdss';
      compileDirective();
      scope.$digest();

      expect(scope.form.password.$valid).toBeFalsy();
      expect(scope.form.password.$error.required).toBeFalsy();
      expect(scope.passwordErrors).toEqual(['The password must contain at least one special character.']);
      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('should show 20% progress and "danger" color', function() {
      scope.passwordMock.password = 'P';
      compileDirective();
      scope.$digest();

      expect(scope.requirementsColor).toEqual('danger');
      expect(scope.requirementsProgress).toEqual('20');
    });

    it('should show 40% progress and "warning" color', function() {
      scope.passwordMock.password = 'Pa';
      compileDirective();
      scope.$digest();

      expect(scope.requirementsColor).toEqual('warning');
      expect(scope.requirementsProgress).toEqual('40');
    });

    it('should show 60% progress and "info" color', function() {
      scope.passwordMock.password = 'Pa$';
      compileDirective();
      scope.$digest();

      expect(scope.requirementsColor).toEqual('info');
      expect(scope.requirementsProgress).toEqual('60');
    });

    it('should show 80% progress and "primary" color', function() {
      scope.passwordMock.password = 'Pa$$w0rd';
      compileDirective();
      scope.$digest();

      expect(scope.requirementsColor).toEqual('primary');
      expect(scope.requirementsProgress).toEqual('80');
    });

    it('should show 100% progress and "success" color', function() {
      scope.passwordMock.password = 'Pa$$w0rd!!';
      compileDirective();
      scope.$digest();

      expect(scope.requirementsColor).toEqual('success');
      expect(scope.requirementsProgress).toEqual('100');
    });

  });
}());

'use strict';

describe('Users E2E Tests:', function () {
  describe('Signin Validation', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/authentication/signin');
      element(by.css('button[type=submit]')).click();
      // Username Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Username is required.');
      // Password Error
      expect(element.all(by.css('.error-text')).get(1).getText()).toBe('Password is required.');
    });
  });
});

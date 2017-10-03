'use strict';

describe('Settings E2E Tests:', function () {
  describe('Test Settings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/settings');
      expect(element.all(by.repeater('setting in settings')).count()).toEqual(0);
    });
  });
});

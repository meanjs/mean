'use strict';

describe('Options E2E Tests:', function () {
  describe('Test Options page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/options');
      expect(element.all(by.repeater('option in options')).count()).toEqual(0);
    });
  });
});

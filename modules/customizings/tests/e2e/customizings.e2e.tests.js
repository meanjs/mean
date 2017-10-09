'use strict';

describe('Customizings E2E Tests:', function () {
  describe('Test Customizings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/customizings');
      expect(element.all(by.repeater('customizing in customizings')).count()).toEqual(0);
    });
  });
});

'use strict';

describe('Items E2E Tests:', function () {
  describe('Test items page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/items');
      expect(element.all(by.repeater('item in items')).count()).toEqual(0);
    });
  });
});

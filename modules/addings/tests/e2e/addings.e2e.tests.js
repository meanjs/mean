'use strict';

describe('Addings E2E Tests:', function () {
  describe('Test Addings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/addings');
      expect(element.all(by.repeater('adding in addings')).count()).toEqual(0);
    });
  });
});

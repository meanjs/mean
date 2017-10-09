'use strict';

describe('Sett ings E2E Tests:', function () {
  describe('Test Sett ings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sett-ings');
      expect(element.all(by.repeater('sett-ing in sett-ings')).count()).toEqual(0);
    });
  });
});

'use strict';

describe('Events E2E Tests:', function () {
  describe('Test Events page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/events');
      expect(element.all(by.repeater('event in events')).count()).toEqual(0);
    });
  });
});

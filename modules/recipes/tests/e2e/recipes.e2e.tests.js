'use strict';

describe('Recipes E2E Tests:', function () {
  describe('Test Recipes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/recipes');
      expect(element.all(by.repeater('recipe in recipes')).count()).toEqual(0);
    });
  });
});

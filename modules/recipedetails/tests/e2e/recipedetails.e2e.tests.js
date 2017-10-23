'use strict';

describe('Recipedetails E2E Tests:', function () {
  describe('Test Recipedetails page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/recipedetails');
      expect(element.all(by.repeater('recipedetail in recipedetails')).count()).toEqual(0);
    });
  });
});

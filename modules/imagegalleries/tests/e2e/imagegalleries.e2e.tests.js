'use strict';

describe('Imagegalleries E2E Tests:', function () {
  describe('Test Imagegalleries page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/imagegalleries');
      expect(element.all(by.repeater('imagegallery in imagegalleries')).count()).toEqual(0);
    });
  });
});

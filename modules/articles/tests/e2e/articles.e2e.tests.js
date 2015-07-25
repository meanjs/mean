'use strict';

describe('Articles E2E Tests:', function () {
	describe('Test articles page', function () {
		it('Should report missing credentials', function () {
			browser.get('http://localhost:3000/#!/articles');
			expect(element.all(by.repeater('article in articles')).count()).toEqual(0);
		});
	});
});

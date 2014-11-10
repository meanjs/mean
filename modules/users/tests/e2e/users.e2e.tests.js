'use strict';

describe('Users E2E Tests:', function() {
	describe('Signin Validation', function() {
		it('Should report missing credentials', function() {
			browser.get('http://localhost:3000/#!/authentication/signin');
			element(by.css('button[type=submit]')).click();
			element(by.binding('error')).getText().then(function(errorText) {
				expect(errorText).toBe('Missing credentials');
			});
		});
	});
});

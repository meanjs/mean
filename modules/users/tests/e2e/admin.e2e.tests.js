'use strict';

describe('Users E2E Tests:', function () {

	var user1 = {
	    firstName: 'test',
	    lastName: 'user',
	    email: 'test.user@meanjs.com',
	    username: 'testUser',
	    password: 'P@$$w0rd!!'
  	};

  	var user2 = {
  		firstName: 'another',
	    lastName: 'user',
	    email: 'another.user@meanjs.com',
	    username: 'anotherUser',
	    password: 'P@$$w0rd!z!'
  	};

  	var admingSignin = function () {
	    // Make sure user is signed out first
	    browser.get('http://localhost:3001/signout');
	    // Delete all cookies
		browser.driver.manage().deleteAllCookies();

		browser.get('http://localhost:3001/signin');
		element(by.model('vm.credentials.usernameOrEmail')).sendKeys('admintest');
		element(by.model('vm.credentials.password')).sendKeys('Scipor300!');
		element(by.css('button[type="submit"]')).click();
	};

  	it('Should Successfully register new user', function () {
      browser.get('http://localhost:3001/signup');
      // Enter FirstName
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter LastName
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter UserName
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');
    });

    it('Should Successfully register new user', function () {
      browser.get('http://localhost:3001/signup');
      // Enter FirstName
      element(by.model('vm.credentials.firstName')).sendKeys(user2.firstName);
      // Enter LastName
      element(by.model('vm.credentials.lastName')).sendKeys(user2.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user2.email);
      // Enter UserName
      element(by.model('vm.credentials.username')).sendKeys(user2.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user2.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');
    });


    it('Should let admin approve a new user', function () {
    	admingSignin();
    	browser.get('http://localhost:3001/admin/unapproved');
    	element(by.css('button[class="btn-success"]')).click()
    });

});
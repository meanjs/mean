'use strict';

describe('Items E2E Tests:', function () {
  var admin = {
    username: 'seedadmintest',
    password: 'P@$$w0rd!!'
  };
  var testItem = {
  	title: 'title',
  	module: 'thermodynamics',
  	category: 'beaker',
  	count: '5',
  	content: 'yep'
  };
  var category = {
  	title: 'title',
  	hexColor: '#FAE123'
  };
  var module = {
  	title: 'title',
  	hexColor: '#123FAE'
  };

  var signout = function () {
    // Make sure user is signed out first
    browser.get('http://localhost:3001/signout');
    // Delete all cookies
    browser.driver.manage().deleteAllCookies();
  };

  var signin = function() {
    signout();
    browser.get('http://localhost:3001/signin');
      // Enter UserName
      element(by.model('vm.credentials.usernameOrEmail')).sendKeys(admin.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(admin.password);
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
  };
  beforeAll(function() {
  	signin();
  });
  describe('Test items page', function () {
    it('Should navigate to item page with an admin login', function () {
     browser.get('http://localhost:3001/items');
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/items');
    });
    it('Should navigate to create page upon button click', function () {
     browser.get('http://localhost:3001/items');
     element(by.id('add-item-btn')).click();
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/items/create');
    });
    it('Should not create an item without a title', function () {
     browser.get('http://localhost:3001/items/create');
     element(by.css('button[type=submit]')).click();
     expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Item title is required.');
    });
    it('Should create an item with a title', function () {
     browser.get('http://localhost:3001/items/create');
     element(by.model('vm.item.title')).sendKeys(testItem.title);
     element(by.css('button[type=submit]')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/items');
    });
  });
  describe('Test Categories, Modules pages', function () {
    it('Should navigate to category page with an admin login', function () {
     browser.get('http://localhost:3001/admin/items/categories');
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/admin/items/categories');
    });
    it('Should navigate to category create page upon button click', function () {
     browser.get('http://localhost:3001/admin/items/categories');
     element(by.id('add-category-btn')).click();
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/admin/items/categories/create');
 });
    it('Should not create an category without a title', function () {
     browser.get('http://localhost:3001/admin/items/categories/create');
     element(by.model('vm.cat.hexColor')).sendKeys(category.hexColor);
     element(by.css('button[type=submit]')).click();
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/admin/items/categories/create');
    });
    it('Should not create an category without a color', function () {
     browser.get('http://localhost:3001/admin/items/categories/create');
     element(by.model('vm.cat.title')).sendKeys(category.title);
     element(by.css('button[type=submit]')).click();
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/admin/items/categories/create');
    });
    it('Should create an category with a title', function () {
     browser.get('http://localhost:3001/admin/items/categories/create');
     element(by.model('vm.cat.hexColor')).sendKeys(category.hexColor);
     element(by.model('vm.cat.title')).sendKeys(category.title);
     element(by.css('button[type=submit]')).click();
     var alertDialog = browser.switchTo().alert();
     expect(alertDialog.accept).toBeDefined();
     alertDialog.accept();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/admin/items/categories');
    });
    it('Should navigate to module page with an admin login', function () {
     browser.get('http://localhost:3001/admin/items/modules');
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/admin/items/modules');
    });
    it('Should navigate to module create page upon button click', function () {
     browser.get('http://localhost:3001/admin/items/modules');
     element(by.id('add-module-btn')).click();
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/admin/items/modules/create');
 });
    it('Should not create an module without a title', function () {
     browser.get('http://localhost:3001/admin/items/modules/create');
     element(by.model('vm.mod.hexColor')).sendKeys(module.hexColor);
     element(by.css('button[type=submit]')).click();
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/admin/items/modules/create');
    });
    it('Should not create an module without a color', function () {
     browser.get('http://localhost:3001/admin/items/modules/create');
     element(by.model('vm.mod.title')).sendKeys(module.title);
     element(by.css('button[type=submit]')).click();
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/admin/items/modules/create');
    });
    it('Should create an module with a title', function () {
     browser.get('http://localhost:3001/admin/items/modules/create');
     element(by.model('vm.mod.title')).sendKeys(module.title);
     element(by.model('vm.mod.hexColor')).sendKeys(module.hexColor);
     element(by.css('button[type=submit]')).click();
     var alertDialog = browser.switchTo().alert();
     expect(alertDialog.accept).toBeDefined();
     alertDialog.accept();
     expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/admin/items/modules');
    });
});
});
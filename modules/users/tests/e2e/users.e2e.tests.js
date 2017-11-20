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
    firstName: 'test',
    lastName: 'user2',
    email: 'test.user2@meanjs.com',
    username: 'testUser2',
    password: 'P@$$w0rd!!'
  };
  var admin = {
    username: 'seedadmintest',
    password: 'P@$$w0rd!!'
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
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');
  };
  describe('AddUsers Tests', function () {

    it('Should report missing first name', function () {
      // Sign in
      signin();
      browser.get('http://localhost:3001/admin/add');
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      //Enter Additional Elements
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // First Name Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('First name is required.');
    });
    it('Should report missing last name', function () {
      browser.get('http://localhost:3001/admin/add');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Last Name Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Last name is required.');
    });

  });
  describe('Signup Validation', function () {
    it('Should report missing first name', function () {
      signout();
      browser.get('http://localhost:3001/signup');
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      //Enter Additional Elements
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // First Name Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('First name is required.');
    });

    it('Should report missing last name', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Last Name Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Last name is required.');
    });

    it('Should report missing email address', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Email address is required.');
    });

    it('Should report invalid email address - "123"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys('123');
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Email address is invalid.');
    });

    /**
     * Note: 123@123 is a valid email adress according to HTML5.
     * However, 123@123@123 is an invalid email address.
     */
    it('Should report invalid email address - "123@123@123"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys('123@123@123');
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Email address is invalid.');
    });

    it('Should report invalid username - ".login"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('.login');
      //Enter Additional Elements
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
    });

    it('Should report invalid username - "login."', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('login.');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
    });

    it('Should report invalid username - "log..in"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('log..in');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
    });

    it('Should report invalid username - "lo"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('lo');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
    });

    it('Should report invalid username - "log$in"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('log$in');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Email address error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
    });

    it('Should signup username with . - "log.in"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user2.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user2.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys('someemail@meanjs.com');
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys('log.in');
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user2.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Signup successful with username having .
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/');

      signout();
    });

    it('Should report missing username', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Username Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Username is required.');
    });

    it('Should report a password with less than 10 characters long - "P@$$w0rd!"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('P@$$w0rd!');
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must be at least 10 characters long.');
    });

    it('Should report a password with greater than 128 characters long.', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      //Enter Additional Elements
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys(')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must be fewer than 128 characters.');
    });

    it('Should report a password with more than 3 or more repeating characters - "P@$$w0rd!!!"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      //Enter Additional Elements
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('P@$$w0rd!!!');
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password may not contain sequences of three or more repeated characters.');
    });

    it('Should report a password with no uppercase letters - "p@$$w0rd!!"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('p@$$w0rd!!');
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one uppercase letter.');
    });

    it('Should report a password with less than one number - "P@$$word!!"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('P@$$word!!');
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one number.');
    });

    it('Should report a password with less than one special character - "Passw0rdss"', function () {
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user1.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user1.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys('Passw0rdss');
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('The password must contain at least one special character.');
    });

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

    it('Should report Email already exists', function () {
      // Make sure user is signed out first
      signout();
      // Signup
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user2.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user2.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user2.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys(user2.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.message')).get(0).getText()).toBe('Email already exists');
    });

    it('Should report Username already exists', function () {
      // Signup
      browser.get('http://localhost:3001/signup');
      // Enter First Name
      element(by.model('vm.credentials.firstName')).sendKeys(user2.firstName);
      // Enter Last Name
      element(by.model('vm.credentials.lastName')).sendKeys(user2.lastName);
      // Enter Email
      element(by.model('vm.credentials.email')).sendKeys(user2.email);
      // Enter Username
      element(by.model('vm.credentials.username')).sendKeys(user1.username);
      // Enter Invalid Password
      element(by.model('vm.credentials.password')).sendKeys(user2.password);
      //Enter Additional Elements
      // Click Submit button
      element(by.css('button[type=submit]')).click();
      // Password Error
      expect(element.all(by.css('.message')).get(0).getText()).toBe('Username already exists');
    });

  });

  describe('Signin Validation', function () {

    it('Should report missing credentials', function () {
      // Make sure user is signed out first
      signout();
      // Sign in
      browser.get('http://localhost:3001/signin');
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      // Username Error
      expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Username or Email is required.');
      // Password Error
      expect(element.all(by.css('.error-text')).get(1).getText()).toBe('Password is required.');
    });

    it('Verify that the user is logged out if unapproved', function () {
      // Make sure user is signed out first
      signout();
      // Sign in
      browser.get('http://localhost:3001/signin');
      // Enter UserName
      element(by.model('vm.credentials.usernameOrEmail')).sendKeys(user1.username);
      // Enter Password
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      // Click Submit button
      element(by.css('button[type="submit"]')).click();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/signin');
    });

  });
});
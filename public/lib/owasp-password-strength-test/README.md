OWASP Password Strength Test
============================
`owasp-password-strength-test` is a password-strength tester based off of the
[OWASP Guidelines for enforcing secure passwords][guidelines]. It is
lightweight, extensible, has no dependencies, and can be used on the server
(nodejs) or in-browser.

`owasp-password-strength-test` is not an OWASP project - it is merely based off
of OWASP research.

[![Build Status](https://travis-ci.org/nowsecure/owasp-password-strength-test.svg)](https://travis-ci.org/nowsecure/owasp-password-strength-test)


Installing
----------
### Server-side (nodejs) ###
From the command line:

```sh
npm install owasp-password-strength-test
```

### In-browser ###
Within your document:

```html
<script src='owasp-password-strength-test.js'></script>
```

Features
--------
This module is built upon the following beliefs:

1. [Passphrases are better than passwords][xkcd].

2. Passwords should be subject to stricter complexity requirements than
   passphrases.

Thus, the module:

- **provides for "required" and "optional" tests**. In order to be considered
  "strong", a password must pass _all_ required tests, as well as a
  configurable number of optional tests. This makes it possible to always
  enforce certain rules (like minimum password length), while giving users
  flexibility to honor only some of a pool of lower-priority rules.

- **encourages the use of passphrases over passwords**. Passphrases (by
  default) are not subject to the same complexity requirements as a password.
  (Whereby, by default, a "passphrase" can be defined as "a password whose
  length is greater than or equal to 20 characters.")

- **can be arbitrarily extended** as-needed with additional required and
  optional tests.


Usage
-----
After you've included it into your project, using the module is
straightforward:

### Server-side ###
```javascript
// require the module
var owasp = require('owasp-password-strength-test');

// invoke test() to test the strength of a password
var result = owasp.test('correct horse battery staple');
```

### In-browser ###
```javascript
// in the browser, including the script will make a
// `window.owaspPasswordStrengthTest` object availble.
var result = owaspPasswordStrengthTest.test('correct horse battery staple');
```

The returned value will take this shape when the password is valid:

```javascript
{
  errors              : [],
  failedTests         : [],
  requiredTestErrors  : [],
  optionalTestErrors  : [],
  passedTests         : [ 0, 1, 2, 3, 4, 5, 6 ],
  isPassphrase        : false,
  strong              : true,
  optionalTestsPassed : 4
}

```

... and will take this shape when the password is invalid:

```javascript
{
  errors: [
      'The password must be at least 10 characters long.',
      'The password must contain at least one uppercase letter.',
      'The password must contain at least one number.',
      'The password must contain at least one special character.'
    ],
    failedTests         : [ 0, 4, 5, 6 ],
    passedTests         : [ 1, 2, 3 ],
    requiredTestErrors  : [
      'The password must be at least 10 characters long.',
    ],
    optionalTestErrors  : [
      'The password must contain at least one uppercase letter.',
      'The password must contain at least one number.',
      'The password must contain at least one special character.'
    ],
    isPassphrase        : false,
    strong              : false,
    optionalTestsPassed : 1
}
```

Whereby:

- `errors` is an `array` of `string`s of error messages associated with the
  failed tests.

- `failedTests` enumerates which tests have failed, beginning from 0 with the
  first required test

- `passedTests` enumerates which tests have succeeded, beginning from 0 with
  the first required test

- `requiredTestErrors` is an array containing the error messages of required
  tests that have failed.

- `optionalTestErrors` is an array containing the error messages of optional
  tests that have failed.

- `isPassphrase` is a `boolean` indicating whether or not the password was
  considered to be a passphrase.

- `strong` is a `boolean` indicating whether or not the user's password
  satisfied the strength requirements.

- `optionalTestsPassed` is a `number` indicating how many of the optional tests
  were passed. In order for the password to be considered "strong", it (by
  default) must either be a passphrase, or must pass a number of optional tests
  that is equal to or greater than `configs.minOptionalTestsToPass`.


Configuring
-----------
The module may be configured as follows:


```javascript
var owasp = require('owasp-password-strength-test');

// Pass a hash of settings to the `config` method. The settings shown here are
// the defaults.
owasp.config({
  allowPassphrases       : true,
  maxLength              : 128,
  minLength              : 10,
  minPhraseLength        : 20,
  minOptionalTestsToPass : 4,
});
```

Whereby:

- `allowPassphrases` is a `boolean` that toggles the "passphrase" mechanism on
  and off. If set to `false`, the strength-checker will abandon the notion of
  "passphrases", and will subject all passwords to the same complexity
  requirements.

- `maxLength` is a constraint on a password's maximum length.

- `minLength` is a constraint on a password's minimum length.

- `minPhraseLength` is the minimum length a password needs to achieve in order
  to be considered a "passphrase" (and thus exempted from the optional
  complexity tests by default).

- `minOptionalTestsToPass` is the minimum number of optional tests that a
  password must pass in order to be considered "strong". By default (per the
  OWASP guidelines), four optional complexity tests are made, and a password
  must pass at least three of them in order to be considered "strong". 


Extending
---------
If you would like to filter passwords through additional tests beyond the
default, you may simply push new tests onto the appropriate arrays within the
module's `test` object:

```javascript
var owasp = require('owasp-password-strength-test');

// push "required" tests onto `tests.required` array, and push "optional" tests
// onto the `tests.optional` array.
owasp.tests.required.push(function(password) {
  if (password === 'one two three four five') {
    return "That's the kind of thing an idiot would have on his luggage!";
  }
});
```

Test functions must resemble the following:

```javascript
// accept the password as the single argument
function(password) {

  // the "if" conditional should evaluate to `true` if the password is bad
  if (thePasswordIsBad) {

    // On password failure, a string should be returned. It will be pushed
    // onto an array of errors associated with the password.
    return "This is the failure message associated with the test";
  }

  // if the password is OK, nothing should be returned
}

```


Testing
-------
To run the module's test suite, `cd` into its directory and run `npm test`. You
may first need to run `npm install` to install the required development
dependencies. (These dependencies are **not** required in a production
environment, and facilitate only unit testing.)


Contributing
------------
If you would like to contribute code, please fork this repository, make your
changes, and then submit a pull-request.

[guidelines]: https://www.owasp.org/index.php/Authentication_Cheat_Sheet#Implement_Proper_Password_Strength_Controls
[xkcd]: http://xkcd.com/936/ 

2015-10-22
==========

  * Merge pull request [#999](https://github.com/meanjs/mean/issues/999) from mleanos/morgan-logger-config
    [bug] Enable log options for Morgan that were missed in the 0.4.0 merge

2015-10-19
==========

  * Enable log options for Morgan
    Adds the log options, and format to the Morgan middleware in the Express
    configuration.
    These options are defined in the environment configurations.
    The implementation derived from https://github.com/meanjs/mean/pull/254
    by @lirantal, which somehow got overlooked when merging 0.4.0 into
    master.
    Added tests for the Logger configuration.
    Added the log settings to the Test env config.
    Added environment variables for the log settings in the Test &
    Production env configs.
    Moved the Morgan Express middleware outside of the NODE_ENV ===
    'development' check. Morgan should be used in all environments, and use
    the settings set in each env config.
    Changed the wording of the Stream option comments in the env configs.
    Added Rotating Logs functionality, and refactored the log Stream
    options. Added a new npm package, FileStreamRotator, for use with
    Morgan's rotating logs functionality.
    Also, refactored the log configuration tests to be more maintainable.
    Added more tests, and refactored test suite to use mock-fs.

2015-10-18
==========

  * Merge pull request [#1009](https://github.com/meanjs/mean/issues/1009) from codydaig/bug/mongoose
    [hotfix] Lock mongoose version to a working version
  * Lock mongoose version to a working version

2015-10-17
==========

  * Merge pull request [#1004](https://github.com/meanjs/mean/issues/1004) from lirantal/feature/travis-webhooks-as-env-variables
    Moving Travis CI webhooks config to environment variable
  * fixes [#898](https://github.com/meanjs/mean/issues/898) - addressing the issue where the webhook API is hard-coded into the travis config file
  * Merge pull request [#987](https://github.com/meanjs/mean/issues/987) from mleanos/favicon-path-bug
    [bug] Favicon invalid path [fixes [#979](https://github.com/meanjs/mean/issues/979)]

2015-10-16
==========

  * Favicon invalid path
    Removed the {{url}} from the Favicon path. This fixes the intermittent
    issues with the path resolving to an invalid location.
    Removed the url from the twitter:image & og:image tags, to be static
    references to the logo.
  * Merge pull request [#1002](https://github.com/meanjs/mean/issues/1002) from codydaig/docs/contributing-docs
    [docs] Information about Contributing
  * [docs] Information about Contributing
  * Merge pull request [#990](https://github.com/meanjs/mean/issues/990) from ilanbiala/eslint
    Add ESLint
    Fixes [#763](https://github.com/meanjs/mean/issues/763)
  * Merge pull request [#1000](https://github.com/meanjs/mean/issues/1000) from tatethurston/docs/requirements
    Added Ruby and Sass to requirements with install directions
  * Merge pull request [#1001](https://github.com/meanjs/mean/issues/1001) from ilanbiala/node-pre-gyp
    Remove node-pre-gyp
    Fixes [#938](https://github.com/meanjs/mean/issues/938)
  * Merge pull request [#985](https://github.com/meanjs/mean/issues/985) from jloveland/karma-coverage
    Add karma coverage to grunt
  * Update package.json
  * adding karma coverage for grunt
  * Added Ruby and Sass to requirements with install directions
  * Merge pull request [#993](https://github.com/meanjs/mean/issues/993) from jloveland/e2e-fail-travis
    Adding configuration to fail grunt task if e2e tests fail
  * removing keepAlive conf to fail travis if e2e tests fail

2015-10-15
==========

  * Merge pull request [#910](https://github.com/meanjs/mean/issues/910) from jloveland/hide-password-validator
    Hide the password strength progress when the field is empty
  * Merge pull request [#991](https://github.com/meanjs/mean/issues/991) from ilanbiala/formatting-fixes
    Formatting fixes for ESLint
  * Add ESLint support
  * Format code according to ESLint rules

2015-10-14
==========

  * Merge pull request [#957](https://github.com/meanjs/mean/issues/957) from mleanos/seeddb-enhance-testability
    Seed options - logResults

2015-10-12
==========

  * adding tests for directives
  * renaming strength meter, hiding  when password field is empty, and refactoring directives to use $validators

2015-10-11
==========

  * Merge pull request [#972](https://github.com/meanjs/mean/issues/972) from mleanos/mocha-global-timeout-grunt
    Global Mocha timeout

2015-10-10
==========

  * Merge pull request [#959](https://github.com/meanjs/mean/issues/959) from lirantal/feature/user-route-tests-improve-3
    User CRUD API tests
  * updating travis to support installing a local mail server
  * adding more API tests

2015-10-09
==========

  * Global Mocha timeout
    Added the timeout option to the Mocha grunt task; set to 10000.
    Removed the individual test suite timeouts, for all server tests.
    Also, added global timeout for Mocha gulp task.
  * Merge pull request [#967](https://github.com/meanjs/mean/issues/967) from mleanos/user-model-validate-bug
    [bug] Solves User model validation issue with tests [fixes [#966](https://github.com/meanjs/mean/issues/966)]

2015-10-08
==========

  * Synchronous tests
    Removed the done() callback method from the config tests that aren't
    truly asynchronous.
  * Formatting and Indentation
    Changes to formatting and indentation.
  * Seed options - logResults
    Added an options object to the database seed configuration. Currently,
    the only option implemented is `logResults`; set using the seedDB env
    config
    options (default to "true").
    Modified the definition of the env config for seedDB. It's now an
    object, with
    options.
    Setting the logResults option is set to `false` in the core
    configuration server test suite.
    Also, fixed an issue with how env configs were reading the seedDB
    setting from the env variables. Previously, the config was getting set
    by
    looking for merely the existence of the env variable (MONGO_SEED).
    However,
    if this setting existed but was set to "false", the seedDB would be
    turned on.
    Added the SeedDB user details to the env config, and seedDB options.
    Added tests to the core server config test suite
    should have seedDB configuration set for "regular" user
    should have seedDB configuration set for admin user
    should seed admin, and "regular" user accounts when NODE_ENV is set to
    "test" when they already exist
    should ONLY seed admin user account when NODE_ENV is set to "production"
    with custom admin
    should seed admin, and "regular" user accounts when NODE_ENV is set to
    "test" with custom options
    should NOT seed admin user account if it already exists when NODE_ENV is
    set to "production"
    should NOT seed "regular" user account if missing email when NODE_ENV
    set to "test"
    Added support for environment variables to seedDB env configs; currently
    only supporting username & email.
    Refactored how the SeedDB rejects were being handled
  * Merge pull request [#971](https://github.com/meanjs/mean/issues/971) from jloveland/session-tests-return
    Add return done() to session secret configuration tests
  * adding return done() to tests
  * Merge pull request [#968](https://github.com/meanjs/mean/issues/968) from jloveland/e2e-test-error
    Adding protractor options to fix travis failing

2015-10-06
==========

  * Merge pull request [#927](https://github.com/meanjs/mean/issues/927) from jloveland/local-session-secret
    adding ability to configure session.secret in local env config

2015-10-05
==========

  * Merge pull request [#922](https://github.com/meanjs/mean/issues/922) from lirantal/feature/travis-add-node-v4-gcc-update
    NodeJS v4 support - fixing the failed build
  * adding the required support to properly build the nodejs v4 edition
    updating grunt-node-inspector version to compatible version with nodejs v4

2015-10-04
==========

  * adding protractor options to fix travis failing
  * Solves User model validation bug
    This solves the issue of the User model's pre('validate') method,
    attempting to validate against a password that was not modified.
    Adds the this.isModified('password') check to the condition.

2015-10-03
==========

  * adding ability to configure session.secret in local env config
  * Merge pull request [#939](https://github.com/meanjs/mean/issues/939) from jloveland/e2e-tests-fix
    Fix grunt and gulp e2e tests, Fixes [#929](https://github.com/meanjs/mean/issues/929)

2015-10-02
==========

  * Merge pull request [#956](https://github.com/meanjs/mean/issues/956) from mleanos/mocha-test-suite-timeouts
    Mocha test timeouts [fixes [#955](https://github.com/meanjs/mean/issues/955)]

2015-09-30
==========

  * Merge pull request [#944](https://github.com/meanjs/mean/issues/944) from SibuStephen/patch-1
    Link for download link (NodeJs download)

2015-09-29
==========

  * Mocha test timeouts [fixes [#955](https://github.com/meanjs/mean/issues/955)]
    Added a timeout of 10000 ms to each server test file. This is an attempt
    to solve the timeout issues that we're experiencing with the Mocha
    tests. Especially, this is hoping to address the build fails that are
    caused by such timeouts.
    Issue is described in https://github.com/meanjs/mean/issues/955
  * Merge pull request [#937](https://github.com/meanjs/mean/issues/937) from lirantal/feature/seeddb-refactoring
    SeedDB Refactoring

2015-09-28
==========

  * fixing grunt and gulp e2e tests
  * Link for download link (NodeJs download)
    Link for the node js download is mismatching.

2015-09-27
==========

  * Merge pull request [#904](https://github.com/meanjs/mean/issues/904) from jloveland/jshint-single-quotes
    fixing jshint single quotes issues
  * adding tests for meanjs core server functionality
  * refactoring the seeddb logic to work with promises all over due to all the async behavior

2015-09-26
==========

  * fixing spacing

2015-09-25
==========

  * Merge pull request [#901](https://github.com/meanjs/mean/issues/901) from igorauad/fixRedirection
    Fix redirection to previous state after required authentication
  * Merge pull request [#891](https://github.com/meanjs/mean/issues/891) from codydaig/bug/gulphang
    Enable running tests through Gulp
    closes [#873](https://github.com/meanjs/mean/issues/873)

2015-09-23
==========

  * Merge pull request [#921](https://github.com/meanjs/mean/issues/921) from mleanos/dbseed-user-passwords
    [hotfix] Fixes db seed password bug

2015-09-22
==========

  * Merge pull request [#924](https://github.com/meanjs/mean/issues/924) from lirantal/bugfix/923-ssl-support-for-password-reset
    Fixed [#923](https://github.com/meanjs/mean/issues/923) - password reset links SSL support

2015-09-21
==========

  * Merge pull request [#928](https://github.com/meanjs/mean/issues/928) from lirantal/feature/user-route-tests-improve
    Tests - Adding route tests for user/admin CRUD operations
  * Repeating Characters condition
    Added a regular expression test to the while condition, in order to
    ensure no repeat characters are present in the generated password.
  * [hotfix] Fixes db seed password bug
    Fixes the database seeding bug with the password not passing the owasp
    test.
    Adds a UserSchema static method that generates a random passphrase that passes
    the owasp test.
    Performed minor refactoring of the database seed configuration to
    implement the new UserSchema method.
    Added model test for the UserSchema generateRandomPassphrase static method.

2015-09-20
==========

  * adding route tests for user/admin CRUD operations
  * Merge pull request [#925](https://github.com/meanjs/mean/issues/925) from lirantal/bugfix/user-route-tests-typos
    Updating comments for tests in code

2015-09-19
==========

  * updating comments for tests in code

2015-09-18
==========

  * Fix redirection to previous state after required authentication
    Fixes the issue with the previous state not being recorded, when the
    unauthenticated user is redirected to the signin state, when trying to
    access a restricted route.
    Added a function that stores the provided state & state params, in the
    $state.previous object. This has been implemented in the
    $stateChangeSuccess event, and the callback of the $state.go transition
    when the user is not allowed to access the requested route.
  * fixed bug [#923](https://github.com/meanjs/mean/issues/923) - making password reset links work for both http and https configuration

2015-09-17
==========

  * Merge pull request [#917](https://github.com/meanjs/mean/issues/917) from simison/patch-13
    Update Bower manifest

2015-09-15
==========

  * Update Bower manifest
    - Remove deprecated "version": http://bower.io/docs/creating-packages/#version
    - Add "license"
    - Add "homepage"
    - Use fuzzier version requirement for angular-messages (~)
  * Merge pull request [#906](https://github.com/meanjs/mean/issues/906) from lirantal/feature/travis-add-node-v4
    Supporting NodeJS v4 in Travis CI

2015-09-14
==========

  * adding caching for packages and npm modules across builds. Also setting sudo to false as it's not used for anything during the build

2015-09-13
==========

  * Merge pull request [#911](https://github.com/meanjs/mean/issues/911) from simonlinj/patch-1
    Fix typo
  * Fix typo
    indent and typo fixes

2015-09-12
==========

  * Merge pull request [#909](https://github.com/meanjs/mean/issues/909) from codydaig/patch-1
    [bug] Seed Password's strength [Closes [#908](https://github.com/meanjs/mean/issues/908)]
  * [bug] Seed Password's strength [Closes [#908](https://github.com/meanjs/mean/issues/908)]

2015-09-11
==========

  * Merge pull request [#801](https://github.com/meanjs/mean/issues/801) from codydaig/docs/pull793
    Add seed user instructions to README
  * updating .travis.yml file for allowing builds to fail

2015-09-10
==========

  * adding support for nodejs v4 and allowing it to fail without failing the complete build for CI
  * fixing jshint issues by requiring single quotes

2015-09-09
==========

  * Merge pull request [#890](https://github.com/meanjs/mean/issues/890) from lirantal/feature/article-module-dummy-config-dir
    Adding sample config/ directory for articles module

2015-09-08
==========

  * Merge pull request [#878](https://github.com/meanjs/mean/issues/878) from jloveland/owasp-password-strength
    Adding stronger password security
  * [doc] Add seed user instructions to README
  * Merge pull request [#893](https://github.com/meanjs/mean/issues/893) from lirantal/feature/seeddb-refactor-users
    Refactoring the seeded user objects to be easily maintained

2015-09-07
==========

  * Merge pull request [#887](https://github.com/meanjs/mean/issues/887) from lirantal/feature/app-startup-version-number
    Adding MEAN.JS version information as part of the startup info when app loads

2015-09-06
==========

  * adding stronger password requirements for improving security based on OWASP
  * [bug] Gulp test wasn't running server tests

2015-09-05
==========

  * Refactoring the seeded user objects to be easily maintained
  * Dummy config directory for the articles module to make it easier for developers to understand and realize there's an actual per-module config/ directory/files that can be added
  * Adding support for meanjs-version specific configuration option and displaying both MEAN.JS project and App project version numbers on start-up

2015-09-04
==========

  * Adding MEAN.JS version information as part of the startup info when app loads

2015-09-03
==========

  * Merge pull request [#886](https://github.com/meanjs/mean/issues/886) from lirantal/feature/travis-ci-enable-coverage-task
    Adding another job for Travis CI to run the `grunt coverage` task on every build

2015-09-02
==========

  * Adding another job for Travis CI to run the `grunt coverage` task on every build

2015-09-01
==========

  * Merge pull request [#876](https://github.com/meanjs/mean/issues/876) from codydaig/0.4.1
    0.4.1
  * 0.4.1
  * Merge pull request [#875](https://github.com/meanjs/mean/issues/875) from meanjs/travis-gitter-integration
    Add Travis notifications in Gitter
  * Travis now sends notifications to Gitter

2015-08-31
==========

  * Merge pull request [#866](https://github.com/meanjs/mean/issues/866) from almegdad/0.4.0
    Reopened: Force Username & Email to Lowercase + Remove Sensitive Data
  * Force Lowercase & Remove Sensitive Data
    * add directive to force username & email lowercase
    * remove sensitive data in password reset
    * 2 space indentation  in reset & forgot password views
  * Merge pull request [#864](https://github.com/meanjs/mean/issues/864) from codydaig/bug/cfconfig
    [bug] Remove non CF specific files [closes [#861](https://github.com/meanjs/mean/issues/861)]
  * Merge pull request [#811](https://github.com/meanjs/mean/issues/811) from lirantal/feature/code-coverage
    Adding coverage report for server-side tests using istanbul
(function () {
  'use strict';

  // PasswordValidator service used for testing the password strength
  angular
    .module('users.services')
    .factory('PasswordValidator', PasswordValidator);

  PasswordValidator.$inject = ['$window', '$http'];

  function PasswordValidator($window, $http) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    // get the owasp config from the server configuration
    $http.get('/password/rules').success(function (response) {
      owaspPasswordStrengthTest.configs = response; // same owasp config used on the server
    }).error(function (response) {
      // well, it should fall back on the default owasp config defined in that package
    });

    var service = {
      getResult: getResult,
      getPopoverMsg: getPopoverMsg
    };

    return service;

    function getResult(password) {
      var result = owaspPasswordStrengthTest.test(password);
      return result;
    }

    function getPopoverMsg() {
      var popoverMsg = 'Please enter a passphrase or password with ' + owaspPasswordStrengthTest.configs.minLength + ' or more characters, numbers, lowercase, uppercase, and special characters.';

      return popoverMsg;
    }
  }

}());

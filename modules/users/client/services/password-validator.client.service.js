(() => {
  // PasswordValidator service used for testing the password strength
  angular
    .module('users.services')
    .factory('PasswordValidator', PasswordValidator);

  PasswordValidator.$inject = ['$window'];

  function PasswordValidator($window) {
    const owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    const service = {
      getResult,
      getPopoverMsg
    };

    return service;

    function getResult(password) {
      const result = owaspPasswordStrengthTest.test(password);
      return result;
    }

    function getPopoverMsg() {
      const popoverMsg = 'Please enter a passphrase or password with ' + owaspPasswordStrengthTest.configs.minLength + ' or more characters, numbers, lowercase, uppercase, and special characters.';

      return popoverMsg;
    }
  }
})();
